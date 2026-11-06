package com.example.damiProd.SecurityTests;

import com.example.damiProd.domain.Employee;
import com.example.damiProd.domain.EmployeeRole;
import com.example.damiProd.domain.Session;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * An admin can see and revoke somebody else's devices (TODO-56).
 *
 * Before this, /api/auth/sessions was the whole story and it is self-scoped, so
 * a lost driver phone left only blunt levers: change the person's role (which
 * revokes sessions as a SIDE EFFECT and changes what they may do), delete them,
 * or wait out ecotrack.security.refresh-token-ttl-days, which is a year.
 *
 * Runs against the REAL filter chain, because the thing worth asserting is not
 * that a service method flips a column - it is that the revoked device's token
 * stops authenticating. {@link AuthorizationMatrixTest} covers who may call
 * these paths; this covers what happens when they do.
 *
 * @Transactional, and that is not optional. TODO-31 gives every @SpringBootTest
 * its own database per CONTEXT, and contexts are cached by configuration -
 * @Transactional is not part of that key, so this class shares a context, and
 * therefore a database, with {@link LastAdminGuardTest}. That class asserts
 * things about the WHOLE employee table ("this is the last admin"), so a
 * committed ADMIN seeded here breaks it. Rolling back is what keeps this class
 * from being visible to its neighbour.
 */
@SpringBootTest
@AutoConfigureTestDatabase
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AdminSessionRevocationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeRoleRepository employeeRoleRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Employee admin;
    private Employee driver;
    private String adminToken;

    @BeforeEach
    void setUp() {
        admin = seed("session_admin", "ADMIN");
        driver = seed("session_driver", "DRIVER");
        // The admin's own device. Every test starts from exactly this one
        // session on the admin and none on the driver.
        adminToken = tokenService.issueNewSession(admin, "admin-laptop").accessToken();
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

    private JsonNode getJson(String path) throws Exception {
        String body = mockMvc.perform(get(path).header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body);
    }

    // ------------------------------------------------------------------ read

    @Test
    void listsTheDeviceLabelAndTimestampsAnAdminNeedsToPickTheLostPhone() throws Exception {
        tokenService.issueNewSession(driver, "Samsung Galaxy A54");
        tokenService.issueNewSession(driver, "iPhone 13");

        JsonNode sessions = getJson("/api/admin/employees/" + driver.getId() + "/sessions");

        assertThat(sessions).hasSize(2);
        assertThat(sessions).allSatisfy(node -> {
            assertThat(node.get("device").asText()).isNotBlank();
            assertThat(node.get("createdAt").isNull()).isFalse();
            assertThat(node.get("lastUsedAt").isNull()).isFalse();
        });
        // Revoking blind is not an option when someone holds up to
        // max-sessions-per-user devices; the label is how the right row is found.
        assertThat(sessions.findValuesAsText("device"))
                .containsExactlyInAnyOrder("Samsung Galaxy A54", "iPhone 13");
    }

    @Test
    void noSessionIsMarkedAsTheAdminsOwnDeviceWhenLookingAtSomebodyElse() throws Exception {
        tokenService.issueNewSession(driver, "Samsung Galaxy A54");

        JsonNode sessions = getJson("/api/admin/employees/" + driver.getId() + "/sessions");

        assertThat(sessions.get(0).get("current").asBoolean()).isFalse();
    }

    @Test
    void marksTheAdminsOwnCurrentDeviceWhenTheyLookAtThemselves() throws Exception {
        JsonNode sessions = getJson("/api/admin/employees/" + admin.getId() + "/sessions");

        assertThat(sessions).hasSize(1);
        assertThat(sessions.get(0).get("current").asBoolean()).isTrue();
    }

    /**
     * An unknown id is a 404, never an empty list. "This person has no devices"
     * and "there is no such person" are different answers, and a typo that reads
     * as the first is how an admin concludes a lost phone is already dead.
     */
    @Test
    void unknownEmployeeIsNotFoundRatherThanAnEmptyList() throws Exception {
        mockMvc.perform(get("/api/admin/employees/999999/sessions")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/admin/employees/999999/sessions")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }

    // ---------------------------------------------------------------- revoke

    @Test
    void revokingOneDeviceStopsThatTokenAndLeavesTheOtherWorking() throws Exception {
        TokenService.IssuedTokens lost = tokenService.issueNewSession(driver, "Samsung Galaxy A54");
        TokenService.IssuedTokens kept = tokenService.issueNewSession(driver, "iPhone 13");

        mockMvc.perform(delete("/api/admin/employees/" + driver.getId() + "/sessions/" + lost.sessionId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        // The point of the whole item: the phone in the wrong hands stops working.
        mockMvc.perform(get("/api/tasks/mine").header("Authorization", "Bearer " + lost.accessToken()))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/tasks/mine").header("Authorization", "Bearer " + kept.accessToken()))
                .andExpect(status().isOk());
    }

    /** The employee id in the URL is the scoping check, not decoration. */
    @Test
    void cannotRevokeASessionThroughTheWrongEmployeeId() throws Exception {
        TokenService.IssuedTokens driversSession = tokenService.issueNewSession(driver, "Samsung Galaxy A54");

        mockMvc.perform(delete("/api/admin/employees/" + admin.getId()
                        + "/sessions/" + driversSession.sessionId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/tasks/mine")
                        .header("Authorization", "Bearer " + driversSession.accessToken()))
                .andExpect(status().isOk());
    }

    @Test
    void revokingEveryDeviceReportsHowManyAndSignsThemAllOut() throws Exception {
        TokenService.IssuedTokens first = tokenService.issueNewSession(driver, "Samsung Galaxy A54");
        TokenService.IssuedTokens second = tokenService.issueNewSession(driver, "iPhone 13");

        String body = mockMvc.perform(delete("/api/admin/employees/" + driver.getId() + "/sessions")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertThat(objectMapper.readTree(body).get("revoked").asInt()).isEqualTo(2);
        for (String token : List.of(first.accessToken(), second.accessToken())) {
            mockMvc.perform(get("/api/tasks/mine").header("Authorization", "Bearer " + token))
                    .andExpect(status().isUnauthorized());
        }
    }

    /**
     * An admin cleaning up their OWN row must not sign themselves out mid-task -
     * and for the last admin that would walk straight into TODO-30's lockout.
     * Same "every device but this one" rule DELETE /api/auth/sessions has; the
     * per-session delete can still end this session deliberately.
     */
    @Test
    void bulkRevokeSparesTheAdminsOwnCurrentSession() throws Exception {
        TokenService.IssuedTokens otherLaptop = tokenService.issueNewSession(admin, "old-laptop");

        String body = mockMvc.perform(delete("/api/admin/employees/" + admin.getId() + "/sessions")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertThat(objectMapper.readTree(body).get("revoked").asInt()).isEqualTo(1);
        mockMvc.perform(get("/api/tasks/mine").header("Authorization", "Bearer " + otherLaptop.accessToken()))
                .andExpect(status().isUnauthorized());
        // Still signed in.
        mockMvc.perform(get("/api/tasks/mine").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    /**
     * The session row outlives the session by session-retention-days, so the
     * reason on it is the only record of why a device stopped working. "The
     * owner pressed Deconectare" and "an admin revoked a lost phone" are the two
     * answers someone will be asking between.
     */
    @Test
    void recordsThatAnAdminDidIt() throws Exception {
        TokenService.IssuedTokens lost = tokenService.issueNewSession(driver, "Samsung Galaxy A54");

        mockMvc.perform(delete("/api/admin/employees/" + driver.getId() + "/sessions/" + lost.sessionId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        Session revoked = sessionRepository.findById(lost.sessionId()).orElseThrow();
        assertThat(revoked.getRevokedReason()).isEqualTo(TokenService.REVOKED_BY_ADMIN);
    }
}
