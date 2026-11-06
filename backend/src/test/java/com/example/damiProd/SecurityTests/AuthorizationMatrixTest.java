package com.example.damiProd.SecurityTests;

import com.example.damiProd.domain.Employee;
import com.example.damiProd.domain.EmployeeRole;
import com.example.damiProd.repository.EmployeeRepository;
import com.example.damiProd.service.TokenService;
import com.example.damiProd.repository.EmployeeRoleRepository;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Authorization (who may do what), as opposed to authentication (whether a
 * caller is anyone at all, which {@link AuthEnforcementOnTest} covers).
 *
 * Before this matrix existed, any valid token was effectively an admin token:
 * the only role rule in the whole app was /api/admin/**, so a DRIVER token
 * could create employees, delete clients or wipe routes.
 *
 * Probing "allowed" without side effects: an authorized request that then fails
 * on its *body* (400 from an unparseable payload, 415 from a non-multipart
 * upload) proves the request got past the filter chain, because authorization
 * runs before Spring MVC ever looks at the body. Any 401/403 means it did not.
 */
@SpringBootTest
@AutoConfigureTestDatabase
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthorizationMatrixTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeRoleRepository employeeRoleRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String driverToken;
    private String salesToken;
    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        driverToken = mintToken(seed("authz_driver", "DRIVER"));
        salesToken = mintToken(seed("authz_sales", "SALES"));
        adminToken = mintToken(seed("authz_admin", "ADMIN"));
    }

    private Employee seed(String username, String roleName) {
        EmployeeRole role = employeeRoleRepository.findByRoleName(roleName)
                .orElseGet(() -> employeeRoleRepository.save(new EmployeeRole(roleName)));
        return employeeRepository.findByUsername(username).orElseGet(() -> {
            Employee employee = new Employee(username, username, "0700000000");
            employee.setRoles(Set.of(role));
            return employeeRepository.save(employee);
        });
    }

    /**
     * Mints a session directly instead of POSTing credentials.
     *
     * There is no login endpoint any more - a session is only ever created by
     * an admin approving a device (see EnrollmentService). These tests are
     * about what a VALID token may then do, so they take the short path to one
     * rather than driving the whole enrollment flow; EnrollmentFlowTest covers
     * that end to end.
     */
    private String mintToken(Employee employee) {
        return tokenService.issueNewSession(employee, "test-device").accessToken();
    }

    // ---------------------------------------------------------------------
    // Employee management is admin-only (it is the privilege-escalation path:
    // create an account, give it any role you like).
    //
    // POST/DELETE /api/employees no longer have a handler at all - they were
    // removed from EmployeeController - but the matchers stay and so do these
    // tests: authorization runs before dispatch, so a non-admin still gets 403
    // rather than 405, and the day someone adds a write back under this path it
    // is denied by default instead of silently open. Defence in depth, asserted.
    // ---------------------------------------------------------------------

    @Test
    void driver_cannotCreateEmployees() throws Exception {
        mockMvc.perform(post("/api/employees")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void sales_cannotCreateOrDeleteEmployees() throws Exception {
        mockMvc.perform(post("/api/employees")
                        .header("Authorization", "Bearer " + salesToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/employees/1")
                        .header("Authorization", "Bearer " + salesToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void sales_cannotReachAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/employees")
                        .header("Authorization", "Bearer " + salesToken))
                .andExpect(status().isForbidden());
    }

    // onlyAdmin_mayPurgeLegacyIdPhotos covered DELETE/GET /api/admin/id-photos,
    // the one-time drain of the ID photos EcoTrack used to store. The drain is
    // done and the endpoint is deleted (TODO-45). The property it asserted -
    // that a path under /api/admin/** inherits ADMIN with no matcher row of its
    // own - is still covered by the other cases in this class.

    // ---------------------------------------------------------------------
    // Business writes: office staff only.
    // ---------------------------------------------------------------------

    @Test
    void driver_cannotWriteBusinessData() throws Exception {
        mockMvc.perform(post("/api/clients")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/tasks/1")
                        .header("Authorization", "Bearer " + driverToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(patch("/api/tasks/1/scheduled-date")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void sales_mayWriteBusinessData() throws Exception {
        int status = mockMvc.perform(post("/api/clients")
                        .header("Authorization", "Bearer " + salesToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("not-json"))
                .andReturn().getResponse().getStatus();

        // 400 (unreadable body) - i.e. it reached the MVC layer, which is all
        // this assertion is about.
        assertThat(status).isEqualTo(400);
    }

    // ---------------------------------------------------------------------
    // The two writes the driver app actually performs must keep working.
    // ---------------------------------------------------------------------

    @Test
    void driver_mayUpdateTaskStatus() throws Exception {
        int status = mockMvc.perform(patch("/api/tasks/1/status")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("not-json"))
                .andReturn().getResponse().getStatus();

        assertThat(status).isEqualTo(400);
    }

    @Test
    void driver_mayUploadTaskPhotos() throws Exception {
        // A multipart request with no "files" part: 400 from the missing part,
        // which only happens once authorization has already let it through.
        int status = mockMvc.perform(multipart("/api/tasks/1/photos")
                        .header("Authorization", "Bearer " + driverToken))
                .andReturn().getResponse().getStatus();

        assertThat(status).isEqualTo(400);
    }

    // ---------------------------------------------------------------------
    // Reads stay open to every signed-in employee, and everyone manages their
    // own sessions regardless of role.
    // ---------------------------------------------------------------------

    @Test
    void officeRoles_mayRead() throws Exception {
        for (String token : new String[] { salesToken, adminToken }) {
            mockMvc.perform(get("/api/employees").header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void driver_cannotReadOfficeData() throws Exception {
        // Reads used to be open to any authenticated role (TODO-116); the full
        // driver read surface is in AuthHardeningTest.
        mockMvc.perform(get("/api/employees").header("Authorization", "Bearer " + driverToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void driver_mayManageOwnSessions() throws Exception {
        mockMvc.perform(get("/api/auth/sessions").header("Authorization", "Bearer " + driverToken))
                .andExpect(status().isOk());

        // "log out my other devices" is a DELETE under /api/auth/** - it must not
        // fall into the office-staff-only DELETE rule.
        mockMvc.perform(delete("/api/auth/sessions").header("Authorization", "Bearer " + driverToken))
                .andExpect(status().isNoContent());
    }

    /**
     * The admin session endpoints (TODO-56) have NO matcher row of their own -
     * they inherit ADMIN from /api/admin/**, which is matched above the
     * office-staff DELETE catch-all. That is the property being asserted here:
     * a SALES token is refused all three, including the DELETEs it would
     * otherwise be allowed by `DELETE /api/** -> OFFICE`.
     */
    @Test
    void nonAdmins_cannotReachAnotherEmployeesSessions() throws Exception {
        long targetId = seed("authz_target", "DRIVER").getId();

        for (String token : new String[] { driverToken, salesToken }) {
            mockMvc.perform(get("/api/admin/employees/" + targetId + "/sessions")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden());

            mockMvc.perform(delete("/api/admin/employees/" + targetId + "/sessions")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden());

            mockMvc.perform(delete("/api/admin/employees/" + targetId + "/sessions/1")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden());
        }
    }

    @Test
    void admin_mayReadAndRevokeAnotherEmployeesSessions() throws Exception {
        Employee target = seed("authz_revocable", "DRIVER");
        mintToken(target);

        mockMvc.perform(get("/api/admin/employees/" + target.getId() + "/sessions")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/admin/employees/" + target.getId() + "/sessions")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void admin_mayDoEverything() throws Exception {
        mockMvc.perform(get("/api/admin/employees").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        int status = mockMvc.perform(post("/api/clients")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("not-json"))
                .andReturn().getResponse().getStatus();
        assertThat(status).isEqualTo(400);
    }

    @Test
    void infrastructureConsoles_areNeverRoutable() throws Exception {
        int status = mockMvc.perform(get("/h2-console/")
                        .header("Authorization", "Bearer " + adminToken))
                .andReturn().getResponse().getStatus();

        assertThat(status).isIn(401, 403, 404);
    }
}
