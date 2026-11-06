package com.example.damiProd.SecurityTests;

import com.example.damiProd.repository.AccessRequestRepository;
import com.example.damiProd.repository.EmployeeRepository;
import com.example.damiProd.repository.SessionRepository;
import com.example.damiProd.service.TokenService;
import com.example.damiProd.domain.Employee;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The per-IP limit on {@code POST /api/enrollment/request} (TODO-116).
 *
 * The per-device limit counts a device id the CLIENT chooses, so a fresh id per
 * request walked straight past it and anyone could fill the admin's queue with
 * invented names. The IP is the one thing a caller cannot pick freely.
 *
 * {@code forwarded-for-hops=1} is the Cloud Run shape: the platform APPENDS the
 * address it saw, so the rightmost X-Forwarded-For entry is the real client and
 * anything to its left was written by the caller.
 */
@SpringBootTest
@AutoConfigureTestDatabase
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "ecotrack.enrollment.max-requests-per-ip-per-hour=3",
        "ecotrack.security.forwarded-for-hops=1",
})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class EnrollmentIpRateLimitTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private TokenService tokenService;
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private AccessRequestRepository accessRequestRepository;
    @Autowired private SessionRepository sessionRepository;

    private int deviceCounter;

    @BeforeEach
    void notFirstRun() {
        sessionRepository.deleteAll();
        accessRequestRepository.deleteAll();
        employeeRepository.deleteAll();
        // Not first run, so a request is an ordinary PENDING one.
        Employee existing = employeeRepository.save(new Employee("someone", "Someone", "0700000000"));
        tokenService.issueNewSession(existing, "x");
    }

    private ResultActions requestFrom(String forwardedFor) throws Exception {
        var builder = post("/api/enrollment/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "Spam " + deviceCounter,
                        // A new device id every time: the per-device limit never trips.
                        "deviceId", "device-" + deviceCounter++)));
        if (forwardedFor != null) {
            builder = builder.header("X-Forwarded-For", forwardedFor);
        }
        return mockMvc.perform(builder);
    }

    @Test
    void freshDeviceIdsFromOneAddress_areLimited() throws Exception {
        for (int i = 0; i < 3; i++) {
            requestFrom("203.0.113.7").andExpect(status().isOk());
        }
        requestFrom("203.0.113.7").andExpect(status().isTooManyRequests());
        // A different client is unaffected.
        requestFrom("198.51.100.9").andExpect(status().isOk());
    }

    @Test
    void aSpoofedLeftmostEntry_doesNotBuyAFreshBudget() throws Exception {
        for (int i = 0; i < 3; i++) {
            requestFrom("10.0.0." + i + ", 203.0.113.7").andExpect(status().isOk());
        }
        requestFrom("10.9.9.9, 203.0.113.7").andExpect(status().isTooManyRequests());
    }
}
