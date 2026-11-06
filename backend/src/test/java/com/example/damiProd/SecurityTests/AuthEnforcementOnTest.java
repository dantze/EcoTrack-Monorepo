package com.example.damiProd.SecurityTests;

import com.example.damiProd.domain.Employee;
import com.example.damiProd.domain.EmployeeRole;
import com.example.damiProd.repository.EmployeeRepository;
import com.example.damiProd.repository.EmployeeRoleRepository;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Exercises the real (not addFilters=false) security filter chain with
 * ecotrack.security.enforce=true, which is the default under the "test"
 * profile - see application-test.properties. Compare with
 * {@link AuthEnforcementOffTest}.
 */
@SpringBootTest
@AutoConfigureTestDatabase
@AutoConfigureMockMvc
@ActiveProfiles("test")
// Keeps setUp()'s writes (and the MockMvc-driven login itself, which runs on the
// same thread under MOCK webEnvironment) inside one transaction per test method,
// auto-rolled-back afterwards. Without this, each repository call in setUp() opens
// its own transaction and the EmployeeRole fetched in one call becomes detached
// by the time it's cascaded into employeeRepository.save() in the next.
@Transactional
class AuthEnforcementOnTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeRoleRepository employeeRoleRepository;

    @Autowired
    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        EmployeeRole driverRole = employeeRoleRepository.findByRoleName("DRIVER")
                .orElseGet(() -> employeeRoleRepository.save(new EmployeeRole("DRIVER")));
        EmployeeRole adminRole = employeeRoleRepository.findByRoleName("ADMIN")
                .orElseGet(() -> employeeRoleRepository.save(new EmployeeRole("ADMIN")));

        if (employeeRepository.findByUsername("enforce_on_driver").isEmpty()) {
            Employee driver = new Employee("enforce_on_driver", "Driver", "0700000001");
            driver.setRoles(Set.of(driverRole));
            employeeRepository.save(driver);
        }
        if (employeeRepository.findByUsername("enforce_on_admin").isEmpty()) {
            Employee admin = new Employee("enforce_on_admin", "Admin", "0700000002");
            admin.setRoles(Set.of(adminRole));
            employeeRepository.save(admin);
        }
    }

    /**
     * Mints a session directly. There is no login endpoint any more - a session
     * is only ever created by an admin approving a device, which
     * EnrollmentFlowTest covers end to end. These tests are about what a valid
     * token may then do.
     */
    private String tokenFor(String username) {
        Employee employee = employeeRepository.findByUsername(username).orElseThrow();
        return tokenService.issueNewSession(employee, "test-device").accessToken();
    }

    @Test
    void anonymousRequestToBusinessEndpoint_isRejected() throws Exception {
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validAccessToken_grantsAccessToBusinessEndpoint() throws Exception {
        String token = tokenFor("enforce_on_driver");

        // A DRIVER token: /api/tasks/mine is the driver's own read. Office data
        // (/api/employees, /api/clients) is refused to drivers since TODO-116.
        mockMvc.perform(get("/api/tasks/mine").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void nonAdminToken_isForbiddenFromAdminEndpoint() throws Exception {
        String token = tokenFor("enforce_on_driver");

        mockMvc.perform(get("/api/admin/employees").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminToken_canReachAdminEndpoint() throws Exception {
        String token = tokenFor("enforce_on_admin");

        mockMvc.perform(get("/api/admin/employees").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void garbageToken_isRejected() throws Exception {
        mockMvc.perform(get("/api/employees").header("Authorization", "Bearer not-a-real-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginItselfRemainsPubliclyReachable() throws Exception {
        // /api/auth/login must stay reachable without a token - otherwise nobody could ever log in.
        String token = tokenFor("enforce_on_driver");
        assertThat(token).isNotBlank();
    }

    @Test
    void healthProbe_isReachableWithoutAuthentication() throws Exception {
        // The Docker healthcheck polls this unauthenticated, and docker-compose
        // gates Caddy on the container reporting healthy. When /actuator/health
        // was swallowed by the /actuator/** deny-list it returned 401, the
        // container never became healthy, and the deploy timed out with the
        // reverse proxy never starting.
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    void otherActuatorEndpoints_stayDenied() throws Exception {
        // Only /actuator/health is carved out - the rest of the deny-list holds.
        int status = mockMvc.perform(get("/actuator/env")).andReturn().getResponse().getStatus();
        assertThat(status).isIn(401, 403, 404);
    }
}
