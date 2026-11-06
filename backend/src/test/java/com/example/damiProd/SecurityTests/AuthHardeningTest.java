package com.example.damiProd.SecurityTests;

import com.example.damiProd.domain.Employee;
import com.example.damiProd.domain.EmployeeRole;
import com.example.damiProd.repository.AccessRequestRepository;
import com.example.damiProd.repository.EmployeeRepository;
import com.example.damiProd.repository.EmployeeRoleRepository;
import com.example.damiProd.repository.SessionRepository;
import com.example.damiProd.service.TokenService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The auth hardening pass (TODO-116), against the real filter chain.
 *
 * <ul>
 *   <li><b>Reads are scoped by role.</b> A driver token used to read every
 *       client's CNP, phone and e-mail, every order and every employee, because
 *       the matrix let any authenticated caller GET anything under /api/**.</li>
 *   <li><b>Approval requires the code.</b> The admin used to see the six-digit
 *       code and approve by name; now the list does not carry it and the admin
 *       must type what the person reads out.</li>
 *   <li><b>Re-enrolment can keep the identity.</b> Every approval used to mint
 *       a new Employee, so a new phone produced a duplicate person.</li>
 * </ul>
 *
 * The per-IP limit is in {@link EnrollmentIpRateLimitTest}, which needs its own
 * properties.
 */
@SpringBootTest
@AutoConfigureTestDatabase
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = "ecotrack.enrollment.require-setup-code=false")
@Transactional
class AuthHardeningTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private TokenService tokenService;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private EmployeeRoleRepository employeeRoleRepository;
    @Autowired private AccessRequestRepository accessRequestRepository;
    @Autowired private SessionRepository sessionRepository;

    private Employee admin;
    private String adminToken;
    private Employee driver;
    private String driverToken;
    private Employee otherDriver;
    private String salesToken;

    @BeforeEach
    void setUp() {
        sessionRepository.deleteAll();
        accessRequestRepository.deleteAll();
        employeeRepository.deleteAll();

        admin = seed("hard_admin", "ADMIN");
        adminToken = tokenService.issueNewSession(admin, "test").accessToken();
        driver = seed("hard_driver", "DRIVER");
        driverToken = tokenService.issueNewSession(driver, "test").accessToken();
        otherDriver = seed("hard_driver_2", "DRIVER");
        salesToken = tokenService.issueNewSession(seed("hard_sales", "SALES"), "test").accessToken();
    }

    private Employee seed(String username, String roleName) {
        EmployeeRole role = employeeRoleRepository.findByRoleName(roleName)
                .orElseGet(() -> employeeRoleRepository.save(new EmployeeRole(roleName)));
        Employee employee = new Employee(username, username, "0700000000");
        employee.setRoles(Set.of(role));
        return employeeRepository.save(employee);
    }

    private ResultActions getAs(String token, String path) throws Exception {
        return mockMvc.perform(get(path).header("Authorization", "Bearer " + token));
    }

    // ------------------------------------------------------------ read scope

    @Test
    void driverOnly_cannotReadOfficeData() throws Exception {
        for (String path : new String[] {
                "/api/clients", "/api/orders", "/api/employees", "/api/products",
                "/api/subscriptions", "/api/routes", "/api/employees/drivers" }) {
            getAs(driverToken, path).andExpect(status().isForbidden());
        }
    }

    @Test
    void officeStaff_stillReadOfficeData() throws Exception {
        getAs(salesToken, "/api/clients").andExpect(status().isOk());
        getAs(salesToken, "/api/employees").andExpect(status().isOk());
        getAs(adminToken, "/api/routes").andExpect(status().isOk());
    }

    @Test
    void driver_readsOwnRoutesButNotAnotherDrivers() throws Exception {
        getAs(driverToken, "/api/routes/employee/" + driver.getId()).andExpect(status().isOk());
        getAs(driverToken, "/api/routes/employee/" + driver.getId() + "/day/1").andExpect(status().isOk());
        getAs(driverToken, "/api/routes/employee/" + otherDriver.getId()).andExpect(status().isForbidden());
        getAs(driverToken, "/api/routes/employee/" + otherDriver.getId() + "/day/1")
                .andExpect(status().isForbidden());
        // Office staff look at anyone's routes, as the dispatch view does.
        getAs(adminToken, "/api/routes/employee/" + otherDriver.getId()).andExpect(status().isOk());
    }

    @Test
    void driver_keepsEverythingTheDriverAppCalls() throws Exception {
        getAs(driverToken, "/api/auth/me").andExpect(status().isOk());
        getAs(driverToken, "/api/auth/sessions").andExpect(status().isOk());
        getAs(driverToken, "/api/tasks/mine").andExpect(status().isOk());
        getAs(driverToken, "/api/tasks/mine/date/2026-01-05").andExpect(status().isOk());
        getAs(driverToken, "/api/tasks/employee/" + driver.getId() + "/date/2026-01-05")
                .andExpect(status().isOk());
    }

    // --------------------------------------------------------- approval code

    private JsonNode request(String name, String deviceId) throws Exception {
        String json = mockMvc.perform(post("/api/enrollment/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("fullName", name, "deviceId", deviceId))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json);
    }

    private ResultActions approve(long requestId, String roleName, String code, Long employeeId) throws Exception {
        Map<String, Object> body = new HashMap<>();
        if (roleName != null) body.put("roleName", roleName);
        if (code != null) body.put("verificationCode", code);
        if (employeeId != null) body.put("employeeId", employeeId);
        return mockMvc.perform(post("/api/admin/enrollment/requests/" + requestId + "/approve")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private JsonNode claim(JsonNode request) throws Exception {
        String json = mockMvc.perform(post("/api/enrollment/claim")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "requestId", request.get("requestId").asLong(),
                                "claimSecret", request.get("claimSecret").asText()))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json);
    }

    @Test
    void approvalWithoutTheCode_isRefused() throws Exception {
        JsonNode req = request("Ion Sofer", "dev-a");
        approve(req.get("requestId").asLong(), "DRIVER", null, null).andExpect(status().isBadRequest());
    }

    @Test
    void approvalWithTheWrongCode_isRefusedAndLeavesTheRequestPending() throws Exception {
        JsonNode req = request("Ion Sofer", "dev-b");
        String code = req.get("verificationCode").asText();
        String wrong = code.equals("000000") ? "111111" : "000000";
        approve(req.get("requestId").asLong(), "DRIVER", wrong, null).andExpect(status().isBadRequest());
        approve(req.get("requestId").asLong(), "DRIVER", code, null).andExpect(status().isOk());
    }

    @Test
    void theAdminListNoLongerCarriesTheCode() throws Exception {
        request("Ion Sofer", "dev-c");
        String json = getAs(adminToken, "/api/admin/enrollment/requests")
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode list = objectMapper.readTree(json);
        assertThat(list).isNotEmpty();
        assertThat(list.get(0).has("verificationCode")).isFalse();
    }

    // -------------------------------------------------------- re-enrolment

    @Test
    void approvingAsAnExistingEmployee_reusesThatEmployee() throws Exception {
        long employeesBefore = employeeRepository.count();
        JsonNode req = request("Hard Driver", "new-phone");
        approve(req.get("requestId").asLong(), null, req.get("verificationCode").asText(), driver.getId())
                .andExpect(status().isOk());

        JsonNode claimed = claim(req);
        assertThat(claimed.get("id").asLong()).isEqualTo(driver.getId());
        assertThat(claimed.get("roles").toString()).contains("DRIVER");
        assertThat(employeeRepository.count()).isEqualTo(employeesBefore);
    }

    @Test
    void approvingAsAnUnknownEmployee_is404() throws Exception {
        JsonNode req = request("Cineva", "dev-d");
        approve(req.get("requestId").asLong(), null, req.get("verificationCode").asText(), 999_999L)
                .andExpect(status().isNotFound());
    }

    @Test
    void approvingAsNewEmployee_stillNeedsAValidRole() throws Exception {
        JsonNode req = request("Cineva", "dev-e");
        approve(req.get("requestId").asLong(), null, req.get("verificationCode").asText(), null)
                .andExpect(status().isBadRequest());
    }
}
