package com.example.damiProd.controller;

import com.example.damiProd.config.EmployeePrincipal;
import com.example.damiProd.dto.AccessRequestResponse;
import com.example.damiProd.dto.ApproveRequestBody;
import com.example.damiProd.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * The admin's approval queue - "Cereri de acces" in the web sidebar.
 *
 * Sits under /api/admin/** so the role matrix in SecurityConfig already gates it
 * to ADMIN; there is no extra check here and there must not need to be one.
 */
@RestController
@RequestMapping("/api/admin/enrollment")
public class AdminEnrollmentController {

    private final EnrollmentService enrollmentService;

    public AdminEnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/requests")
    public ResponseEntity<List<AccessRequestResponse>> pending() {
        return ResponseEntity.ok(enrollmentService.listRequests().stream()
                .map(AccessRequestResponse::from)
                .toList());
    }

    @PostMapping("/requests/{id}/approve")
    public ResponseEntity<?> approve(@AuthenticationPrincipal EmployeePrincipal principal,
            @PathVariable Long id,
            @RequestBody ApproveRequestBody body) {
        Long adminId = principal != null && principal.getEmployee() != null
                ? principal.getEmployee().getId() : null;
        return respond(enrollmentService.approve(id, body.getRoleName(), body.getVerificationCode(),
                body.getEmployeeId(), adminId));
    }

    @PostMapping("/requests/{id}/reject")
    public ResponseEntity<?> reject(@AuthenticationPrincipal EmployeePrincipal principal,
            @PathVariable Long id) {
        Long adminId = principal != null && principal.getEmployee() != null
                ? principal.getEmployee().getId() : null;
        return respond(enrollmentService.reject(id, adminId));
    }

    private ResponseEntity<?> respond(EnrollmentService.DecisionOutcome outcome) {
        return switch (outcome) {
            case OK -> ResponseEntity.ok(Map.of("status", "OK"));
            case NOT_FOUND -> ResponseEntity.status(404).body(Map.of("message", "Cererea nu a fost găsită"));
            case NOT_PENDING -> ResponseEntity.status(409).body(Map.of("message", "Cererea a fost deja procesată"));
            case EXPIRED -> ResponseEntity.status(410).body(Map.of("message", "Cererea a expirat"));
            case BAD_ROLE -> ResponseEntity.badRequest().body(Map.of("message", "Rol invalid"));
            case BAD_CODE -> ResponseEntity.badRequest().body(Map.of("message",
                    "Codul nu corespunde. Cere-i persoanei codul afișat pe ecranul ei."));
            case EMPLOYEE_NOT_FOUND -> ResponseEntity.status(404)
                    .body(Map.of("message", "Angajatul nu a fost găsit"));
        };
    }
}
