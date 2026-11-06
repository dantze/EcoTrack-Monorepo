package com.example.damiProd.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A single logged-in device/browser for an Employee.
 *
 * Tokens themselves are never persisted - only a SHA-256 hash of each opaque
 * token is stored (see service/TokenService.java), so a stolen database
 * backup cannot be used to forge sessions.
 *
 * Refresh tokens rotate on every use: {@code refreshTokenHash} always holds
 * the hash of the currently-valid refresh token, and every hash it replaces is
 * appended to {@code retiredRefreshTokenHashes}. If any already-rotated token
 * is presented again, that is treated as token theft and the whole session is
 * revoked. Keeping the full recent chain rather than only the immediately
 * preceding hash is what lets a token stolen several rotations ago still be
 * recognised as stolen instead of merely failing to work.
 */
@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "refresh_token_hash", nullable = false, unique = true, length = 64)
    private String refreshTokenHash;

    /**
     * Hashes of refresh tokens this session has already rotated away from,
     * oldest first, capped at {@code TokenService.MAX_RETIRED_TOKEN_HASHES}.
     *
     * Presenting any of these is proof that two parties hold tokens from this
     * family, so the session is revoked on sight. The cap keeps the row bounded
     * on a session that refreshes every 30 minutes for a year; a token older
     * than the window is already unusable, it just stops being *attributable*.
     *
     * EAGER because the reuse check runs on the /auth/refresh path outside any
     * open session, and the list is at most a handful of short strings.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "session_retired_tokens", joinColumns = @JoinColumn(name = "session_id"))
    @OrderColumn(name = "position")
    @Column(name = "token_hash", length = 64)
    private List<String> retiredRefreshTokenHashes = new ArrayList<>();

    @Column(name = "access_token_hash", unique = true, length = 64)
    private String accessTokenHash;

    @Column(name = "access_token_expires_at")
    private Instant accessTokenExpiresAt;

    // Free-text label built from the User-Agent header at login/refresh time,
    // e.g. "Chrome on Windows" or "EcoTrack Mobile App". Best-effort only.
    @Column(name = "device_label")
    private String deviceLabel;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "last_used_at", nullable = false)
    private Instant lastUsedAt;

    // Refresh-token expiry for this session (ecotrack.security.refresh-token-ttl-days
    // from creation or last rotation - a year, in every profile we ship).
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    // Set only when a session is killed because a rotated-out refresh token
    // was reused (probable theft), as opposed to a normal logout/admin revoke.
    @Column(name = "revoked_reason")
    private String revokedReason;

    public Session() {
    }

    public boolean isActive(Instant now) {
        return revokedAt == null && expiresAt.isAfter(now);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getRefreshTokenHash() {
        return refreshTokenHash;
    }

    public void setRefreshTokenHash(String refreshTokenHash) {
        this.refreshTokenHash = refreshTokenHash;
    }

    public List<String> getRetiredRefreshTokenHashes() {
        return retiredRefreshTokenHashes;
    }

    public void setRetiredRefreshTokenHashes(List<String> retiredRefreshTokenHashes) {
        this.retiredRefreshTokenHashes = retiredRefreshTokenHashes;
    }

    public String getAccessTokenHash() {
        return accessTokenHash;
    }

    public void setAccessTokenHash(String accessTokenHash) {
        this.accessTokenHash = accessTokenHash;
    }

    public Instant getAccessTokenExpiresAt() {
        return accessTokenExpiresAt;
    }

    public void setAccessTokenExpiresAt(Instant accessTokenExpiresAt) {
        this.accessTokenExpiresAt = accessTokenExpiresAt;
    }

    public String getDeviceLabel() {
        return deviceLabel;
    }

    public void setDeviceLabel(String deviceLabel) {
        this.deviceLabel = deviceLabel;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getLastUsedAt() {
        return lastUsedAt;
    }

    public void setLastUsedAt(Instant lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getRevokedAt() {
        return revokedAt;
    }

    public void setRevokedAt(Instant revokedAt) {
        this.revokedAt = revokedAt;
    }

    public String getRevokedReason() {
        return revokedReason;
    }

    public void setRevokedReason(String revokedReason) {
        this.revokedReason = revokedReason;
    }
}
