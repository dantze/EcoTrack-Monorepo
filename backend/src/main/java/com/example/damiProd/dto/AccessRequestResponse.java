package com.example.damiProd.dto;

import com.example.damiProd.domain.AccessRequest;

import java.time.Instant;

/** One row in the admin's "Cereri de acces" queue. Never exposes the claim secret. */
public record AccessRequestResponse(
        Long id,
        String fullName,
        String deviceLabel,
        String status,
        Instant createdAt,
        Instant expiresAt,
        String assignedRoleName) {

    public static AccessRequestResponse from(AccessRequest request) {
        return new AccessRequestResponse(
                request.getId(),
                request.getFullName(),
                request.getDeviceLabel(),
                request.getStatus().name(),
                request.getCreatedAt(),
                request.getExpiresAt(),
                request.getAssignedRoleName());
    }
}
