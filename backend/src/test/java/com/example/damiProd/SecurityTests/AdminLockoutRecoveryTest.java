package com.example.damiProd.SecurityTests;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.example.damiProd.repository.AccessRequestRepository;
import com.example.damiProd.repository.EmployeeRepository;
import com.example.damiProd.repository.SessionRepository;
import com.example.damiProd.service.EnrollmentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The way back in after the last admin signs out (TODO-30).
 *
 * Before this existed, {@code POST /api/auth/logout} on the only admin device
 * was unrecoverable: nobody could approve an access request, and the
 * first-user-becomes-admin path keys on an EMPTY employees table, which a
 * logout does not produce. The only cure was deleting the database.
 *
 * <strong>The recovery code is read out of the log on purpose.</strong> The log
 * is its only delivery channel, and that is the entire security argument -
 * reading it needs server access, which someone could use to edit the database
 * anyway. A test that reached into the service for the code would be testing a
 * channel that does not exist in production.
 *
 * Runs against the real filter chain, so it also pins that the enrollment
 * endpoints stay reachable from a device holding no token at all.
 */
@SpringBootTest
@AutoConfigureTestDatabase
@AutoConfigureMockMvc
@ActiveProfiles("test")
// OFF so the first request bootstraps directly and these tests can get to the
// state they are actually about. Recovery requires its code REGARDLESS of this
// flag - lockoutRecoveryNeedsItsCodeEvenWithSetupCodeOff pins exactly that.
@TestPropertySource(properties = "ecotrack.enrollment.require-setup-code=false")
class AdminLockoutRecoveryTest {

    private static final Pattern CODE = Pattern.compile("Admin recovery code: ([A-Z0-9]{4}-[A-Z0-9]{4})");

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private AccessRequestRepository accessRequestRepository;
    @Autowired private SessionRepository sessionRepository;

    private ListAppender<ILoggingEvent> logCapture;
    private Logger enrollmentLogger;

    @BeforeEach
    void reset() {
        // Sessions carry an FK to employees, so they go first.
        sessionRepository.deleteAll();
        accessRequestRepository.deleteAll();
        employeeRepository.deleteAll();

        enrollmentLogger = (Logger) LoggerFactory.getLogger(EnrollmentService.class);
        logCapture = new ListAppender<>();
        logCapture.start();
        enrollmentLogger.addAppender(logCapture);
        enrollmentLogger.setLevel(Level.WARN);
    }

    @AfterEach
    void detach() {
        enrollmentLogger.detachAppender(logCapture);
        logCapture.stop();
    }

    // ------------------------------------------------------------- helpers

    /** POST /api/enrollment/request, with an optional setup/recovery code. */
    private JsonNode request(String name, String deviceId, String code) throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("fullName", name);
        payload.put("deviceId", deviceId);
        if (code != null) {
            payload.put("setupCode", code);
        }
        String json = mockMvc.perform(post("/api/enrollment/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json);
    }

    private void requestExpectingRefusal(String name, String deviceId, String code) throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("fullName", name);
        payload.put("deviceId", deviceId);
        if (code != null) {
            payload.put("setupCode", code);
        }
        mockMvc.perform(post("/api/enrollment/request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isForbidden());
    }

    private JsonNode claim(long requestId, String secret) throws Exception {
        String json = mockMvc.perform(post("/api/enrollment/claim")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "requestId", requestId, "claimSecret", secret))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json);
    }

    private JsonNode enrollmentStatus() throws Exception {
        String json = mockMvc.perform(get("/api/enrollment/status"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json);
    }

    private void logout(String refreshToken) throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("refreshToken", refreshToken))))
                .andExpect(status().isNoContent());
    }

    /** The whole first-run path: returns the admin's issued token pair. */
    private JsonNode bootstrapAdmin(String name, String deviceId) throws Exception {
        JsonNode requested = request(name, deviceId, null);
        assertThat(requested.get("autoApproved").asBoolean()).isTrue();
        return claim(requested.get("requestId").asLong(), requested.get("claimSecret").asText());
    }

    /**
     * The recovery code as an operator would get it: scraped out of the log. Null
     * when none was ever announced, which is itself an assertion some tests make.
     */
    private String announcedRecoveryCode() {
        String found = null;
        for (ILoggingEvent event : logCapture.list) {
            Matcher matcher = CODE.matcher(event.getFormattedMessage());
            if (matcher.find()) {
                found = matcher.group(1); // last one wins: a re-mint supersedes
            }
        }
        return found;
    }

    // ------------------------------------------------------------- the state

    @Test
    void whileAnAdminIsSignedIn_thereIsNoLockoutAndNoCode() throws Exception {
        bootstrapAdmin("Andrei Dan", "device-admin");

        JsonNode status = enrollmentStatus();
        assertThat(status.get("adminLockout").asBoolean()).isFalse();
        assertThat(status.get("setupCodeRequired").asBoolean()).isFalse();
        assertThat(announcedRecoveryCode()).isNull();
    }

    @Test
    void theLastAdminLoggingOut_opensRecoveryAndLogsACode() throws Exception {
        JsonNode admin = bootstrapAdmin("Andrei Dan", "device-admin");
        logout(admin.get("refreshToken").asText());

        JsonNode status = enrollmentStatus();
        assertThat(status.get("adminLockout").asBoolean()).isTrue();
        // Same field the clients already render - only the hint text differs.
        assertThat(status.get("setupCodeRequired").asBoolean()).isTrue();
        assertThat(announcedRecoveryCode()).isNotNull();
    }

    @Test
    void aDriverSessionIsNotAnAdminSession() throws Exception {
        JsonNode admin = bootstrapAdmin("Andrei Dan", "device-admin");
        String adminAccess = admin.get("accessToken").asText();

        // A second employee, approved as DRIVER by the admin while they still can.
        JsonNode driverRequest = request("Sofer Unu", "device-driver", null);
        long requestId = driverRequest.get("requestId").asLong();
        mockMvc.perform(post("/api/admin/enrollment/requests/" + requestId + "/approve")
                        .header("Authorization", "Bearer " + adminAccess)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("roleName", "DRIVER",
                                "verificationCode", driverRequest.get("verificationCode").asText()))))
                .andExpect(status().isOk());
        claim(requestId, driverRequest.get("claimSecret").asText());

        // The driver stays signed in; the admin does not. A live session that
        // cannot approve anything must not hide the lockout.
        logout(admin.get("refreshToken").asText());

        assertThat(enrollmentStatus().get("adminLockout").asBoolean()).isTrue();
        assertThat(announcedRecoveryCode()).isNotNull();
    }

    // ------------------------------------------------------------- recovering

    @Test
    void theRecoveryCode_mintsANewAdminThatCanApproveAgain() throws Exception {
        JsonNode admin = bootstrapAdmin("Andrei Dan", "device-admin");
        logout(admin.get("refreshToken").asText());
        enrollmentStatus();
        String code = announcedRecoveryCode();
        assertThat(code).isNotNull();

        JsonNode recovered = request("Andrei Dan", "device-new-phone", code);
        assertThat(recovered.get("autoApproved").asBoolean()).isTrue();

        JsonNode issued = claim(recovered.get("requestId").asLong(),
                recovered.get("claimSecret").asText());
        assertThat(issued.get("roles").toString()).contains("ADMIN");

        // The lockout is over, and the code stops being offered.
        JsonNode after = enrollmentStatus();
        assertThat(after.get("adminLockout").asBoolean()).isFalse();
        assertThat(after.get("setupCodeRequired").asBoolean()).isFalse();

        // And the recovered admin can actually do the thing the lockout blocked.
        JsonNode pending = request("Sofer Unu", "device-driver", null);
        mockMvc.perform(post("/api/admin/enrollment/requests/"
                        + pending.get("requestId").asLong() + "/approve")
                        .header("Authorization", "Bearer " + issued.get("accessToken").asText())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("roleName", "DRIVER",
                                "verificationCode", pending.get("verificationCode").asText()))))
                .andExpect(status().isOk());
    }

    @Test
    void aWrongRecoveryCode_isRefusedAndMintsNobody() throws Exception {
        JsonNode admin = bootstrapAdmin("Andrei Dan", "device-admin");
        logout(admin.get("refreshToken").asText());
        enrollmentStatus();

        long before = employeeRepository.count();
        requestExpectingRefusal("Atacator", "device-attacker", "AAAA-BBBB");
        assertThat(employeeRepository.count()).isEqualTo(before);
        assertThat(enrollmentStatus().get("adminLockout").asBoolean()).isTrue();
    }

    @Test
    void noCodeAtAll_filesAnOrdinaryPendingRequestRatherThanFailing() throws Exception {
        JsonNode admin = bootstrapAdmin("Andrei Dan", "device-admin");
        logout(admin.get("refreshToken").asText());
        enrollmentStatus();

        long before = employeeRepository.count();

        // A driver who happens to ask during a lockout knows nothing about any of
        // this. They must not get a 403 they cannot act on - their request simply
        // waits, exactly as it did before recovery existed.
        JsonNode pending = request("Sofer Unu", "device-driver", null);
        assertThat(pending.get("autoApproved").asBoolean()).isFalse();
        assertThat(employeeRepository.count()).isEqualTo(before);
        assertThat(enrollmentStatus().get("adminLockout").asBoolean()).isTrue();
    }

    @Test
    void theRecoveryCodeIsSingleUse() throws Exception {
        JsonNode admin = bootstrapAdmin("Andrei Dan", "device-admin");
        logout(admin.get("refreshToken").asText());
        enrollmentStatus();
        String code = announcedRecoveryCode();

        JsonNode recovered = request("Andrei Dan", "device-new-phone", code);
        claim(recovered.get("requestId").asLong(), recovered.get("claimSecret").asText());

        // Replaying it is now refused twice over: it is spent, and the lockout it
        // belonged to is closed.
        requestExpectingRefusal("Atacator", "device-attacker", code);
    }

    @Test
    void aCodePresentedWhenNothingIsOpen_isRefused() throws Exception {
        bootstrapAdmin("Andrei Dan", "device-admin");

        // No lockout, no first run. Filing this as an ordinary pending request
        // would leave the sender waiting on a decision they think they made.
        requestExpectingRefusal("Atacator", "device-attacker", "AAAA-BBBB");
    }

    @Test
    void lockoutRecoveryNeedsItsCodeEvenWithSetupCodeOff() throws Exception {
        // require-setup-code=false on this class, so the bootstrap above took no
        // code at all. Recovery still does: the flag exempts the first-run
        // land-grab, which needs an attacker to beat the owner to a brand-new
        // server, and a lockout is one button on one phone away.
        JsonNode admin = bootstrapAdmin("Andrei Dan", "device-admin");
        logout(admin.get("refreshToken").asText());
        enrollmentStatus();

        long before = employeeRepository.count();
        JsonNode pending = request("Atacator", "device-attacker", null);
        assertThat(pending.get("autoApproved").asBoolean()).isFalse();
        assertThat(employeeRepository.count()).isEqualTo(before);
    }
}
