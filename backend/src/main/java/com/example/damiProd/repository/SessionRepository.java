package com.example.damiProd.repository;

import com.example.damiProd.domain.Session;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findByRefreshTokenHash(String refreshTokenHash);

    /**
     * The same lookup under a row lock, for rotation (TODO-116). Rotation is a
     * check-then-write on one row: without the lock, two refreshes presenting
     * the same token both read it as current and both get a fresh pair, so a
     * stolen token used at the same moment as the real one is never caught as
     * reuse. With it, the second waits, finds the hash already rotated, and
     * falls through to the reuse check, which revokes the session.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Session s where s.refreshTokenHash = :hash")
    Optional<Session> findForUpdateByRefreshTokenHash(@Param("hash") String refreshTokenHash);

    /**
     * Finds the still-live session that has already rotated away from this
     * refresh-token hash - i.e. someone is replaying a spent token. Matches
     * anywhere in the retained chain, not just the most recent rotation.
     */
    @Query("SELECT s FROM Session s JOIN s.retiredRefreshTokenHashes h "
            + "WHERE h = :tokenHash AND s.revokedAt IS NULL")
    Optional<Session> findActiveByRetiredRefreshTokenHash(@Param("tokenHash") String tokenHash);

    // Employee is a LAZY @ManyToOne on Session; the caller (TokenService#validateAccessToken)
    // hands the resolved Employee to a servlet filter that runs after this method's own
    // transaction has closed, so the proxy must be initialized here via JOIN FETCH rather
    // than lazily on first access (which would throw LazyInitializationException).
    @Query("SELECT s FROM Session s JOIN FETCH s.employee WHERE s.accessTokenHash = :accessTokenHash")
    Optional<Session> findByAccessTokenHash(@Param("accessTokenHash") String accessTokenHash);

    List<Session> findByEmployeeIdAndRevokedAtIsNullOrderByLastUsedAtDesc(Long employeeId);

    /**
     * How many sessions belonging to holders of a given role can still
     * authenticate someone. "Usable" is measured against the REFRESH token, not
     * the access token: an access token expires every 30 minutes and its owner
     * is not locked out, they just refresh.
     *
     * COUNT(DISTINCT s) because roles is a ManyToMany - without it a session
     * whose owner holds the role twice (it cannot, but the join does not know
     * that) would be counted per matching row.
     *
     * Used by EnrollmentService to detect the one state nobody can get out of:
     * zero usable ADMIN sessions, so no one is left who can approve an
     * enrollment request (TODO-30).
     */
    @Query("SELECT COUNT(DISTINCT s) FROM Session s JOIN s.employee e JOIN e.roles r "
            + "WHERE r.roleName = :roleName AND s.revokedAt IS NULL AND s.expiresAt > :now")
    long countUsableSessionsForRole(@Param("roleName") String roleName, @Param("now") Instant now);

    Optional<Session> findByIdAndEmployeeId(Long id, Long employeeId);

    /**
     * Sessions that can no longer authenticate anyone and are older than the
     * retention cutoff: revoked before it, or expired before it. Called from
     * TokenService#pruneStaleSessions (nightly), never on a request path.
     *
     * Deliberately a SELECT feeding entity-level deletes rather than a bulk
     * `DELETE FROM Session`: a bulk JPQL delete goes straight to SQL and would
     * leave the session_retired_tokens rows behind, orphaned or blocking the
     * delete on the foreign key. The nightly volume does not justify the risk.
     */
    @Query("SELECT s FROM Session s WHERE (s.revokedAt IS NOT NULL AND s.revokedAt < :cutoff) "
            + "OR s.expiresAt < :cutoff")
    List<Session> findStaleSessions(@Param("cutoff") Instant cutoff);
}
