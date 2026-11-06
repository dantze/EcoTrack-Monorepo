package com.example.damiProd.SecurityTests;

import com.example.damiProd.domain.Employee;
import com.example.damiProd.repository.AccessRequestRepository;
import com.example.damiProd.repository.EmployeeRepository;
import com.example.damiProd.repository.SessionRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The whole way in, end to end: request -> admin approves -> device claims.
 *
 * The setup code is switched OFF here so the first request bootstraps directly;
 * {@link EnrollmentBootstrapCodeTest} covers the guarded path.
 */
@SpringBootTest
@AutoConfigureTestDatabase
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = "ecotrack.enrollment.require-setup-code=false")
class EnrollmentFlowTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private AccessRequestRepository accessRequestRepository;
    @Autowired private SessionRepository sessionRepository;

    @BeforeEach
    void reset() {
        // A fresh instance: these tests are about what happens with, and after,
        // an empty employees table.
        // Sessions carry an FK to employees, so they go first.
        sessionRepository.deleteAll();
        accessRequestRepository.deleteAll();
        employeeRepository.deleteAll();
    }

    private JsonNode request(String name, String deviceId) throws Exception {
        String body = objectMapper.writeValueAsString(java.util.Map.of(
                "fullName", name, "deviceId", deviceId));
        String json = mockMvc.perform(post("/api/enrollment/request")
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json);
    }

    /** Approval needs the code the requester reads out (TODO-116). */
    private String approveBody(String role, JsonNode request) throws Exception {
        return objectMapper.writeValueAsString(java.util.Map.of(
                "roleName", role, "verificationCode", request.get("verificationCode").asText()));
    }

    private org.springframework.test.web.servlet.ResultActions claim(long id, String secret) throws Exception {
        String body = objectMapper.writeValueAsString(java.util.Map.of(
                "requestId", id, "claimSecret", secret));
        return mockMvc.perform(post("/api/enrollment/claim")
                .contentType(MediaType.APPLICATION_JSON).content(body));
    }

    // ------------------------------------------------------------ first run

    @Test
    void firstRequestOnAnEmptyInstance_becomesAdminImmediately() throws Exception {
        JsonNode first = request("Andrei Dan", "device-1");
        assertThat(first.get("autoApproved").asBoolean()).isTrue();

        String json = claim(first.get("requestId").asLong(), first.get("claimSecret").asText())
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode issued = objectMapper.readTree(json);

        assertThat(issued.get("accessToken").asText()).isNotBlank();
        assertThat(issued.get("roles").toString()).contains("ADMIN");
    }

    @Test
    void secondRequest_isNotAutoApproved() throws Exception {
        // The bootstrap employee is created during the FIRST request, not at
        // claim time, precisely so this second caller no longer sees an empty
        // instance and cannot also be promoted to ADMIN.
        request("Andrei Dan", "device-1");

        JsonNode second = request("Cineva Altcineva", "device-2");
        assertThat(second.get("autoApproved").asBoolean()).isFalse();

        claim(second.get("requestId").asLong(), second.get("claimSecret").asText())
                .andExpect(status().isAccepted());
    }

    // --------------------------------------------------------- approval loop

    @Test
    void approvedRequest_yieldsTokensWithTheGrantedRole() throws Exception {
        String adminToken = bootstrapAdminToken();

        JsonNode driver = request("Ion Sofer", "device-driver");
        long id = driver.get("requestId").asLong();

        mockMvc.perform(post("/api/admin/enrollment/requests/" + id + "/approve")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(approveBody("DRIVER", driver)))
                .andExpect(status().isOk());

        String json = claim(id, driver.get("claimSecret").asText())
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertThat(objectMapper.readTree(json).get("roles").toString()).contains("DRIVER");
    }

    @Test
    void rejectedRequest_neverYieldsTokens() throws Exception {
        String adminToken = bootstrapAdminToken();
        JsonNode req = request("Cineva", "device-x");
        long id = req.get("requestId").asLong();

        mockMvc.perform(post("/api/admin/enrollment/requests/" + id + "/reject")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        claim(id, req.get("claimSecret").asText()).andExpect(status().isForbidden());
    }

    // ------------------------------------------------------------- the guards

    @Test
    void wrongClaimSecret_getsNothing() throws Exception {
        bootstrapAdminToken();
        JsonNode req = request("Cineva", "device-y");

        // The whole point of the secret: an attacker who knows the request id -
        // they are sequential - still cannot collect somebody else's approval.
        claim(req.get("requestId").asLong(), "not-the-secret")
                .andExpect(status().isNotFound());
    }

    @Test
    void claimSecretIsSingleUse() throws Exception {
        JsonNode first = request("Andrei Dan", "device-1");
        claim(first.get("requestId").asLong(), first.get("claimSecret").asText())
                .andExpect(status().isOk());

        // A replayed secret means a copy leaked; it must never mint a second session.
        claim(first.get("requestId").asLong(), first.get("claimSecret").asText())
                .andExpect(status().isGone());
    }

    @Test
    void pendingRequest_isNotAnError() throws Exception {
        bootstrapAdminToken();
        JsonNode req = request("Cineva", "device-z");

        // 202, so the waiting screen can poll without treating it as a failure.
        claim(req.get("requestId").asLong(), req.get("claimSecret").asText())
                .andExpect(status().isAccepted());
    }

    @Test
    void nonAdminCannotApprove() throws Exception {
        String adminToken = bootstrapAdminToken();

        JsonNode driverReq = request("Ion Sofer", "device-driver");
        long driverId = driverReq.get("requestId").asLong();
        mockMvc.perform(post("/api/admin/enrollment/requests/" + driverId + "/approve")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(approveBody("DRIVER", driverReq)))
                .andExpect(status().isOk());
        String driverJson = claim(driverId, driverReq.get("claimSecret").asText())
                .andReturn().getResponse().getContentAsString();
        String driverToken = objectMapper.readTree(driverJson).get("accessToken").asText();

        JsonNode third = request("Altcineva", "device-3");
        mockMvc.perform(post("/api/admin/enrollment/requests/" + third.get("requestId").asLong() + "/approve")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(approveBody("ADMIN", third)))
                .andExpect(status().isForbidden());
    }

    @Test
    void approvingWithAnUnknownRole_isRejected() throws Exception {
        String adminToken = bootstrapAdminToken();
        JsonNode req = request("Cineva", "device-role");

        mockMvc.perform(post("/api/admin/enrollment/requests/" + req.get("requestId").asLong() + "/approve")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(approveBody("SUPERUSER", req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginEndpointsAreGone() throws Exception {
        // Passwords and Google sign-in were removed outright, not just hidden.
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"admin\"}"))
                .andExpect(result -> assertThat(result.getResponse().getStatus()).isIn(401, 403, 404, 405));
        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idToken\":\"x\"}"))
                .andExpect(result -> assertThat(result.getResponse().getStatus()).isIn(401, 403, 404, 405));
    }

    @Test
    void statusEndpoint_reportsWhetherTheInstanceIsUnclaimed() throws Exception {
        mockMvc.perform(get("/api/enrollment/status"))
                .andExpect(status().isOk())
                .andExpect(result -> assertThat(result.getResponse().getContentAsString())
                        .contains("\"awaitingBootstrap\":true"));

        bootstrapAdminToken();

        mockMvc.perform(get("/api/enrollment/status"))
                .andExpect(status().isOk())
                .andExpect(result -> assertThat(result.getResponse().getContentAsString())
                        .contains("\"awaitingBootstrap\":false"));
    }

    /** Claims the instance and returns the first admin's access token. */
    private String bootstrapAdminToken() throws Exception {
        JsonNode first = request("Andrei Dan", "device-admin");
        String json = claim(first.get("requestId").asLong(), first.get("claimSecret").asText())
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        Employee admin = employeeRepository.findAll().get(0);
        assertThat(admin).isNotNull();
        return objectMapper.readTree(json).get("accessToken").asText();
    }
}
