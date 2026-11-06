package com.example.damiProd.service;

import com.example.damiProd.domain.AccessRequest;
import com.example.damiProd.domain.AccessRequestStatus;
import com.example.damiProd.domain.Employee;
import com.example.damiProd.domain.EmployeeRole;
import com.example.damiProd.dto.EnrollmentRequestResponse;
import com.example.damiProd.repository.AccessRequestRepository;
import com.example.damiProd.repository.EmployeeRepository;
import com.example.damiProd.repository.EmployeeRoleRepository;
import com.example.damiProd.repository.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayDeque;
import java.util.Base64;
import java.util.Comparator;
import java.util.Deque;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Device enrollment: the only way anyone gets into this system.
 *
 * There is no password and no self-registration. A device asks, an admin
 * approves it and picks a role, and the device exchanges a one-time secret for
 * session tokens. See {@link AccessRequest} for what each field protects.
 *
 * FIRST RUN. With an empty employees table nobody can approve anything, so the
 * first request is auto-approved as ADMIN - that is the "first user to open the
 * app is the admin" rule. Left bare that is a land-grab: whoever reaches a
 * freshly deployed server first owns it, permanently, with no password path to
 * take it back. So unless {@code ecotrack.enrollment.require-setup-code} is
 * turned off, that first request must also carry a one-time code printed to the
 * server log at startup. It is not a password: single-use, never stored, gone
 * the moment an admin exists.
 *
 * ADMIN LOCKOUT. The same "nobody can approve anything" state is reachable a
 * second way, and by accident (TODO-30): the last ADMIN presses Deconectare, or
 * their only device is lost, and every ADMIN session is gone while the ADMIN
 * <em>employee</em> still exists. The first-run path does not reopen, because it
 * keys on an EMPTY employees table - so the only cure was destroying the
 * database. {@link #isAdminLockedOut()} detects it (zero usable ADMIN sessions,
 * measured on the refresh token) and a recovery code is logged, exactly like the
 * first-run code; presenting it on /request mints a fresh ADMIN.
 *
 * <strong>Recovery ALWAYS requires the code, even when
 * {@code require-setup-code} is false.</strong> That flag exempts the first-run
 * land-grab, which needs someone to reach a brand-new server before its owner.
 * Lockout is far more reachable than that - one button on one phone - so an
 * unauthenticated caller must never be able to walk into it. The whole mechanism
 * is switched off with {@code ecotrack.enrollment.allow-admin-recovery=false},
 * which restores the old behaviour: lockout is permanent.
 */
@Service
public class EnrollmentService {

    private static final Logger log = LoggerFactory.getLogger(EnrollmentService.class);

    private static final int MAX_NAME_LENGTH = 120;
    private static final int MAX_DEVICE_ID_LENGTH = 128;
    private static final int MAX_DEVICE_LABEL_LENGTH = 200;
    private static final Set<String> ASSIGNABLE_ROLES = Set.of("ADMIN", "SALES", "TECH", "DRIVER");

    private static final String ADMIN_ROLE = "ADMIN";

    /**
     * Shortest operator-chosen first-run code this will accept. The generated
     * code is 8 symbols over a 32-character alphabet (~40 bits); a human-chosen
     * one is worth much less per character, and the endpoint that checks it is
     * public. Anything shorter is refused outright rather than quietly weakening
     * the one gate on "first request becomes ADMIN".
     */
    private static final int MIN_CONFIGURED_SETUP_CODE_LENGTH = 12;

    private final AccessRequestRepository accessRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeRoleRepository employeeRoleRepository;
    private final SessionRepository sessionRepository;
    private final TokenService tokenService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${ecotrack.enrollment.request-ttl-minutes:10}")
    private int requestTtlMinutes;

    @Value("${ecotrack.enrollment.claim-ttl-minutes:10}")
    private int claimTtlMinutes;

    @Value("${ecotrack.enrollment.require-setup-code:true}")
    private boolean requireSetupCode;

    @Value("${ecotrack.enrollment.max-requests-per-device-per-hour:5}")
    private int maxRequestsPerDevicePerHour;

    @Value("${ecotrack.enrollment.max-requests-per-ip-per-hour:20}")
    private int maxRequestsPerIpPerHour;

    @Value("${ecotrack.enrollment.allow-admin-recovery:true}")
    private boolean allowAdminRecovery;

    /**
     * A first-run code chosen by whoever deploys, instead of one this server
     * invents and prints (TODO-36). Blank - the default - keeps the old
     * behaviour. Deliberately does NOT apply to lockout recovery: a code sitting
     * in config that always mints an ADMIN is a password by another name, which
     * is the thing this system does not have.
     */
    @Value("${ecotrack.enrollment.setup-code:}")
    private String configuredSetupCode;

    /**
     * The first-run code. Held in memory only and never persisted: a restart
     * before anyone enrolls mints a new one, which is the safe direction.
     */
    /**
     * Recent request times per client address (TODO-116). The per-device limit
     * counts an id the client invents, so it never stopped a caller who sends a
     * fresh one each time. Held in memory, per instance: an instance that scales
     * away forgets, and N instances allow N times the limit - acceptable for a
     * brake on queue spam, which is all this is.
     */
    private final Map<String, Deque<Instant>> recentRequestsByIp = new ConcurrentHashMap<>();
    private static final int MAX_TRACKED_IPS = 10_000;

    private volatile String setupCode;

    /**
     * The admin-lockout recovery code. Same shape, same rules, same in-memory
     * storage as {@link #setupCode} - and separate from it because the two
     * states are different and only one of them can be live at a time.
     */
    private volatile String recoveryCode;

    public EnrollmentService(AccessRequestRepository accessRequestRepository,
            EmployeeRepository employeeRepository,
            EmployeeRoleRepository employeeRoleRepository,
            SessionRepository sessionRepository,
            TokenService tokenService) {
        this.accessRequestRepository = accessRequestRepository;
        this.employeeRepository = employeeRepository;
        this.employeeRoleRepository = employeeRoleRepository;
        this.sessionRepository = sessionRepository;
        this.tokenService = tokenService;
    }

    // ------------------------------------------------------------------ first run

    @EventListener(ApplicationReadyEvent.class)
    public void announceSetupCodeIfUnclaimed() {
        if (employeeRepository.count() > 0) {
            // Not a fresh install - but it may be a locked-out one, and a restart
            // is the first thing anyone tries when they cannot get in.
            refreshRecoveryCode();
            return;
        }
        if (!requireSetupCode) {
            log.warn("No employees exist and require-setup-code is OFF: the next enrollment request "
                    + "becomes ADMIN with no further checks.");
            return;
        }

        String configured = trimToNull(configuredSetupCode);
        if (configured != null && configured.length() >= MIN_CONFIGURED_SETUP_CODE_LENGTH) {
            // Not logged. The operator set it, so they already have it, and
            // printing a chosen secret would copy it into every log aggregator
            // for no benefit - unlike the generated one, whose only delivery
            // channel IS the log.
            setupCode = configured.toUpperCase(Locale.ROOT);
            log.warn("SETUP: no employees exist yet. Using the configured "
                    + "ecotrack.enrollment.setup-code; it is not printed here.");
            return;
        }
        if (configured != null) {
            // Refuse rather than obey. /api/enrollment/request is public and its
            // rate limit is keyed on a client-supplied device id, so a short
            // chosen code is guessable in a way the generated one is not
            // (8 chars over a 32-symbol alphabet, 40 bits).
            log.error("ecotrack.enrollment.setup-code is set but shorter than {} characters. "
                    + "IGNORING it and generating one instead - a guessable first-run code would "
                    + "hand this instance to whoever guesses it.", MIN_CONFIGURED_SETUP_CODE_LENGTH);
        }

        setupCode = randomSetupCode();
        log.warn("""
                
                ==========================================================
                 SETUP: no employees exist yet.
                 First-run admin code: {}
                 Enter it on the access-request screen to claim this
                 instance. It is single-use and is not stored anywhere.
                 Set ecotrack.enrollment.setup-code (ECOTRACK_SETUP_CODE)
                 to choose this code up front instead of reading it here.
                ==========================================================
                """, setupCode);
    }

    /** True while nobody has claimed this instance yet. */
    public boolean isAwaitingBootstrap() {
        return employeeRepository.count() == 0;
    }

    /**
     * Drives the mobile/web UI: only show the setup-code field when it is needed.
     *
     * True in BOTH states that need a code - first run, and admin lockout. The
     * clients render one field either way; only the hint text differs, which is
     * what {@link #isAdminLockedOut()} on /status is for.
     */
    public boolean setupCodeRequired() {
        return (requireSetupCode && isAwaitingBootstrap()) || isAdminLockedOut();
    }

    // ------------------------------------------------------------------ admin lockout

    /**
     * True when no ADMIN can authenticate any more, so nobody is left to approve
     * an enrollment request (TODO-30).
     *
     * Measured on the REFRESH token - a session whose 30-minute access token has
     * expired is not locked out, its owner refreshes. An employees table that is
     * empty is NOT this state: that is first run, handled above, and reporting
     * both at once would mint two codes for one condition.
     *
     * Reachable by ordinary means and by accident: the last admin presses
     * Deconectare, or loses the only phone they ever enrolled. Note it does not
     * ask whether an ADMIN employee exists - {@code AdminService}'s last-admin
     * guard already makes zero ADMIN employees near-unreachable, and it was never
     * the problem. The problem is an admin who exists and cannot sign in.
     */
    public boolean isAdminLockedOut() {
        if (!allowAdminRecovery || isAwaitingBootstrap()) {
            return false;
        }
        Instant now = Instant.now();
        if (sessionRepository.countUsableSessionsForRole(ADMIN_ROLE, now) > 0) {
            return false;
        }
        // Not locked out, just mid-flight: an ADMIN grant has been approved and
        // its device has not called /claim yet, so the tokens are one request
        // away. Without this, an ordinary first run announces a lockout in the
        // seconds between the bootstrap request and the claim that follows it.
        return accessRequestRepository.countByStatusAndAssignedRoleNameAndExpiresAtAfter(
                AccessRequestStatus.APPROVED, ADMIN_ROLE, now) == 0;
    }

    /**
     * Mints and logs a recovery code on entering lockout, and drops it on
     * leaving. Idempotent, so the /status poll behind the enrollment screen can
     * call it on every request without filling the log: a code is minted only on
     * the transition, and the code itself never leaves the server log.
     *
     * synchronized because two concurrent callers finding a null code would
     * otherwise both mint, and the second would invalidate the first - the
     * person reading the log would be typing a code that had already been
     * replaced.
     */
    private synchronized void refreshRecoveryCode() {
        if (!isAdminLockedOut()) {
            recoveryCode = null;
            return;
        }
        if (recoveryCode != null) {
            return;
        }
        recoveryCode = randomSetupCode();
        log.warn("""

                ==========================================================
                 LOCKOUT: no administrator can sign in any more.
                 Every ADMIN session is revoked or expired, so there is
                 nobody left to approve an access request.
                 Admin recovery code: {}
                 Enter it on the access-request screen to mint a new
                 administrator. Single-use, stored nowhere, and replaced
                 the moment any admin has a session again.
                 Turn this off with ecotrack.enrollment.allow-admin-recovery=false.
                ==========================================================
                """, recoveryCode);
    }

    /**
     * Recomputes the lockout state and its code. Called from the two public
     * enrollment entry points, because nothing else notices the transition: the
     * last admin's logout is a request to /api/auth/logout, which knows nothing
     * about enrollment, and the ADMIN whose refresh token simply expires does not
     * make a request at all. Lazy evaluation on the screen that needs the answer
     * is what avoids coupling those paths together.
     */
    public void reconcileLockoutState() {
        refreshRecoveryCode();
    }

    private boolean recoveryCodeMatches(String provided) {
        String expected = recoveryCode;
        String given = trimToNull(provided);
        if (expected == null || given == null) {
            return false;
        }
        return MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                given.toUpperCase(Locale.ROOT).getBytes(StandardCharsets.UTF_8));
    }

    // ------------------------------------------------------------------ requesting

    public enum RequestOutcome { CREATED, BAD_INPUT, BAD_SETUP_CODE, RATE_LIMITED }

    /**
     * {@code bootstrapped} means "already ADMIN, skip the waiting screen" - true
     * for the first-run claim and for an accepted lockout recovery alike, because
     * the client does the same thing in both cases.
     */
    public record RequestResult(RequestOutcome outcome, EnrollmentRequestResponse response, boolean bootstrapped) {
        static RequestResult fail(RequestOutcome outcome) {
            return new RequestResult(outcome, null, false);
        }
    }

    @Transactional
    public RequestResult request(String fullName, String deviceId, String deviceLabel, String providedSetupCode) {
        return request(fullName, deviceId, deviceLabel, providedSetupCode, null);
    }

    @Transactional
    public RequestResult request(String fullName, String deviceId, String deviceLabel, String providedSetupCode,
            String clientIp) {
        String name = trimToNull(fullName);
        String device = trimToNull(deviceId);
        if (name == null || name.length() > MAX_NAME_LENGTH
                || device == null || device.length() > MAX_DEVICE_ID_LENGTH) {
            return RequestResult.fail(RequestOutcome.BAD_INPUT);
        }

        // Cheap flood guard. The endpoint is public by necessity: someone has to
        // be able to ask before they have any credential at all.
        long recent = accessRequestRepository.countByDeviceIdAndCreatedAtAfter(
                device, Instant.now().minus(1, ChronoUnit.HOURS));
        if (recent >= maxRequestsPerDevicePerHour) {
            return RequestResult.fail(RequestOutcome.RATE_LIMITED);
        }
        if (clientIp != null && ipOverLimit(clientIp, Instant.now())) {
            log.warn("Enrollment request refused: per-address limit reached");
            return RequestResult.fail(RequestOutcome.RATE_LIMITED);
        }

        // Unconditionally, and BEFORE the bootstrap branch: this is what expires a
        // recovery code the moment its lockout ends. Putting it inside the
        // !bootstrap branch left a code minted for one lockout alive across the
        // next one, where it would be silently accepted without ever being
        // re-announced - so the operator would have no code in the log and an old
        // one would still work.
        refreshRecoveryCode();

        boolean bootstrap = isAwaitingBootstrap();
        if (bootstrap && requireSetupCode && !setupCodeMatches(providedSetupCode)) {
            log.warn("Bootstrap enrollment refused: wrong or missing setup code");
            return RequestResult.fail(RequestOutcome.BAD_SETUP_CODE);
        }

        // Admin lockout recovery (TODO-30). Only consulted when this is NOT first
        // run, so the two code paths can never both fire for one request.
        boolean recovering = false;
        if (!bootstrap) {
            if (isAdminLockedOut()) {
                if (trimToNull(providedSetupCode) == null) {
                    // No code offered: fall through to an ordinary PENDING request.
                    // It will sit unapproved until an admin exists, which is exactly
                    // what happened before recovery existed - no worse, and it keeps
                    // a driver who happens to ask during a lockout out of a 403 they
                    // cannot act on.
                    log.warn("Enrollment requested while no admin can sign in; "
                            + "request will stay PENDING until someone recovers admin access");
                } else if (recoveryCodeMatches(providedSetupCode)) {
                    recovering = true;
                } else {
                    log.warn("Admin recovery refused: wrong recovery code");
                    return RequestResult.fail(RequestOutcome.BAD_SETUP_CODE);
                }
            } else if (trimToNull(providedSetupCode) != null) {
                // A code presented when neither state is open is always wrong, and
                // saying so beats silently filing an ordinary request the sender
                // will then wait on for a decision they think they already made.
                log.warn("Setup code presented but neither first run nor admin lockout is open");
                return RequestResult.fail(RequestOutcome.BAD_SETUP_CODE);
            }
        }

        String claimSecret = randomSecret();
        Instant now = Instant.now();

        AccessRequest request = new AccessRequest();
        request.setFullName(name);
        request.setDeviceId(device);
        request.setDeviceLabel(truncate(deviceLabel, MAX_DEVICE_LABEL_LENGTH));
        request.setClaimSecretHash(sha256(claimSecret));
        request.setVerificationCode(randomVerificationCode());
        request.setCreatedAt(now);
        request.setExpiresAt(now.plus(requestTtlMinutes, ChronoUnit.MINUTES));
        request.setStatus(AccessRequestStatus.PENDING);

        if (bootstrap) {
            // Approved inline, and the Employee is created NOW rather than at
            // claim time. That is deliberate: it makes the employees table
            // non-empty immediately, so a second device requesting a moment
            // later no longer sees an unclaimed instance and cannot also be
            // auto-promoted to ADMIN.
            grant(request, ADMIN_ROLE, null, now);
            setupCode = null;
            log.warn("Bootstrap: '{}' claimed this instance as ADMIN", name);
        } else if (recovering) {
            // A NEW admin employee, not a session grafted onto the old one. The
            // name on the form is not proof of identity - the recovery code is
            // what was checked - so guessing which existing employee the caller
            // meant would be inventing an authorisation decision from a string.
            // The stale admin keeps their row and their zero sessions, and the
            // recovered admin can tidy it up in Angajați.
            grant(request, ADMIN_ROLE, null, now);
            // Spent, even though the lockout is not over until the device CLAIMS.
            // If it never does, the next /status finds a lockout with no code and
            // announces a fresh one - which is the right direction: an abandoned
            // half-finished recovery must not leave a live code behind, and it
            // must not lock the door either.
            recoveryCode = null;
            log.warn("Admin recovery: '{}' minted a new ADMIN after a lockout", name);
        }

        accessRequestRepository.save(request);
        return new RequestResult(
                RequestOutcome.CREATED,
                new EnrollmentRequestResponse(request.getId(), claimSecret,
                        request.getVerificationCode(), request.getExpiresAt()),
                bootstrap || recovering);
    }

    // ------------------------------------------------------------------ claiming

    public enum ClaimOutcome { ISSUED, PENDING, REJECTED, EXPIRED, UNKNOWN }

    public record ClaimResult(ClaimOutcome outcome, Employee employee, TokenService.IssuedTokens tokens) {
        static ClaimResult of(ClaimOutcome outcome) {
            return new ClaimResult(outcome, null, null);
        }
    }

    @Transactional
    public ClaimResult claim(Long requestId, String claimSecret, String deviceLabel) {
        if (requestId == null || trimToNull(claimSecret) == null) {
            return ClaimResult.of(ClaimOutcome.UNKNOWN);
        }
        Optional<AccessRequest> found = accessRequestRepository.findById(requestId);
        if (found.isEmpty()) {
            return ClaimResult.of(ClaimOutcome.UNKNOWN);
        }
        AccessRequest request = found.get();

        // Constant-time: a timing difference here would let an attacker walk the
        // secret a byte at a time.
        if (!MessageDigest.isEqual(
                sha256(claimSecret).getBytes(StandardCharsets.UTF_8),
                request.getClaimSecretHash().getBytes(StandardCharsets.UTF_8))) {
            return ClaimResult.of(ClaimOutcome.UNKNOWN);
        }

        Instant now = Instant.now();
        if (request.getStatus() == AccessRequestStatus.PENDING && request.isExpiredAt(now)) {
            request.setStatus(AccessRequestStatus.EXPIRED);
            accessRequestRepository.save(request);
            return ClaimResult.of(ClaimOutcome.EXPIRED);
        }

        return switch (request.getStatus()) {
            case PENDING -> ClaimResult.of(ClaimOutcome.PENDING);
            case REJECTED -> ClaimResult.of(ClaimOutcome.REJECTED);
            // Single-use: a secret already exchanged for tokens is spent. Re-presenting
            // one means a copy leaked, so it must never mint a second session.
            case CLAIMED, EXPIRED -> ClaimResult.of(ClaimOutcome.EXPIRED);
            case APPROVED -> issueFor(request, deviceLabel, now);
        };
    }

    private ClaimResult issueFor(AccessRequest request, String deviceLabel, Instant now) {
        if (request.isExpiredAt(now)) {
            request.setStatus(AccessRequestStatus.EXPIRED);
            accessRequestRepository.save(request);
            return ClaimResult.of(ClaimOutcome.EXPIRED);
        }
        Employee employee = employeeRepository.findById(request.getCreatedEmployeeId()).orElse(null);
        if (employee == null) {
            log.error("Approved request {} has no employee - refusing to issue tokens", request.getId());
            return ClaimResult.of(ClaimOutcome.UNKNOWN);
        }
        TokenService.IssuedTokens tokens = tokenService.issueNewSession(
                employee, deviceLabel != null ? deviceLabel : request.getDeviceLabel());
        request.setStatus(AccessRequestStatus.CLAIMED);
        accessRequestRepository.save(request);
        log.info("Enrollment claimed: employee id={} role={}", employee.getId(), request.getAssignedRoleName());
        return new ClaimResult(ClaimOutcome.ISSUED, employee, tokens);
    }

    // ------------------------------------------------------------------ admin side

    @Transactional(readOnly = true)
    public List<AccessRequest> listRequests() {
        Instant now = Instant.now();
        return accessRequestRepository
                .findByStatusInOrderByCreatedAtDesc(
                        List.of(AccessRequestStatus.PENDING, AccessRequestStatus.APPROVED))
                .stream()
                // Lazy expiry: a row whose window closed is dead even if a sweeper
                // has not rewritten it yet, and must not be offered for approval.
                .filter(r -> !r.isExpiredAt(now))
                .toList();
    }

    public enum DecisionOutcome { OK, NOT_FOUND, NOT_PENDING, EXPIRED, BAD_ROLE, BAD_CODE, EMPLOYEE_NOT_FOUND }

    /**
     * Approves a pending request (TODO-116 added the last two arguments).
     *
     * @param verificationCode what the requester reads out. It is no longer in
     *     the admin's list, so approving proves the admin heard it from the
     *     person holding the device - the only thing that stops a request made
     *     in somebody else's name from being approved on the name alone.
     * @param existingEmployeeId set to re-enrol a person who already exists (a
     *     new phone, a revoked device, a role change that revoked every
     *     session): the device signs in as THAT employee, with their roles,
     *     routes and history, and {@code roleName} is ignored. Null mints a new
     *     employee with {@code roleName}, as before.
     */
    @Transactional
    public DecisionOutcome approve(Long requestId, String roleName, String verificationCode,
            Long existingEmployeeId, Long adminEmployeeId) {
        String role = roleName == null ? null : roleName.trim().toUpperCase(Locale.ROOT);
        if (existingEmployeeId == null && (role == null || !ASSIGNABLE_ROLES.contains(role))) {
            return DecisionOutcome.BAD_ROLE;
        }
        Optional<AccessRequest> found = accessRequestRepository.findById(requestId);
        if (found.isEmpty()) {
            return DecisionOutcome.NOT_FOUND;
        }
        AccessRequest request = found.get();
        if (request.getStatus() != AccessRequestStatus.PENDING) {
            return DecisionOutcome.NOT_PENDING;
        }
        Instant now = Instant.now();
        if (request.isExpiredAt(now)) {
            request.setStatus(AccessRequestStatus.EXPIRED);
            accessRequestRepository.save(request);
            return DecisionOutcome.EXPIRED;
        }
        if (!verificationCodeMatches(request.getVerificationCode(), verificationCode)) {
            log.warn("Access request {}: approval refused, verification code does not match", requestId);
            return DecisionOutcome.BAD_CODE;
        }
        if (existingEmployeeId != null) {
            Optional<Employee> existing = employeeRepository.findById(existingEmployeeId);
            if (existing.isEmpty()) {
                return DecisionOutcome.EMPLOYEE_NOT_FOUND;
            }
            link(request, existing.get(), adminEmployeeId, now);
            accessRequestRepository.save(request);
            log.info("Access request {} approved as existing employee {} by employee {}",
                    requestId, existingEmployeeId, adminEmployeeId);
            return DecisionOutcome.OK;
        }
        grant(request, role, adminEmployeeId, now);
        accessRequestRepository.save(request);
        log.info("Access request {} approved as {} by employee {}", requestId, role, adminEmployeeId);
        return DecisionOutcome.OK;
    }

    @Transactional
    public DecisionOutcome reject(Long requestId, Long adminEmployeeId) {
        Optional<AccessRequest> found = accessRequestRepository.findById(requestId);
        if (found.isEmpty()) {
            return DecisionOutcome.NOT_FOUND;
        }
        AccessRequest request = found.get();
        if (request.getStatus() != AccessRequestStatus.PENDING) {
            return DecisionOutcome.NOT_PENDING;
        }
        request.setStatus(AccessRequestStatus.REJECTED);
        request.setDecidedAt(Instant.now());
        request.setDecidedByEmployeeId(adminEmployeeId);
        accessRequestRepository.save(request);
        return DecisionOutcome.OK;
    }

    /**
     * Marks the request approved and creates the Employee it grants.
     *
     * The employee is created here, at approval, not at claim: the admin sees
     * the person in the employees list the moment they approve, and the
     * bootstrap race described on this class closes.
     */
    private void grant(AccessRequest request, String roleName, Long adminEmployeeId, Instant now) {
        EmployeeRole role = employeeRoleRepository.findByRoleName(roleName)
                .orElseGet(() -> employeeRoleRepository.save(new EmployeeRole(roleName)));

        Employee employee = new Employee();
        employee.setUsername(uniqueUsername(request.getFullName()));
        employee.setFullName(request.getFullName());
        employee.setRoles(Set.of(role));
        employee = employeeRepository.save(employee);

        request.setStatus(AccessRequestStatus.APPROVED);
        request.setAssignedRoleName(roleName);
        request.setDecidedAt(now);
        request.setDecidedByEmployeeId(adminEmployeeId);
        request.setCreatedEmployeeId(employee.getId());
        // The approval itself is short-lived: an approved request the device never
        // collects must not stay claimable indefinitely.
        request.setExpiresAt(now.plus(claimTtlMinutes, ChronoUnit.MINUTES));
    }

    // ------------------------------------------------------------------ helpers

    /**
     * `username` survives as a stable, human-readable handle for existing screens
     * and for uniqueness - it is no longer a credential, because nothing logs in
     * with it any more.
     */
    /**
     * Approves a request as an employee who already exists. No row is created
     * and no role changes: {@code createdEmployeeId} names whom the claim signs
     * in as. {@code assignedRoleName} is display and lockout bookkeeping only -
     * {@link #isAdminLockedOut()} counts approved-but-unclaimed ADMIN requests,
     * so an admin re-enrolling must still read as one.
     */
    private void link(AccessRequest request, Employee employee, Long adminEmployeeId, Instant now) {
        String displayRole = employee.getRoles().stream()
                .map(EmployeeRole::getRoleName)
                .min(Comparator.comparing(name -> ADMIN_ROLE.equals(name) ? "" : name))
                .orElse(null);
        request.setStatus(AccessRequestStatus.APPROVED);
        request.setAssignedRoleName(displayRole);
        request.setDecidedAt(now);
        request.setDecidedByEmployeeId(adminEmployeeId);
        request.setCreatedEmployeeId(employee.getId());
        request.setExpiresAt(now.plus(claimTtlMinutes, ChronoUnit.MINUTES));
    }

    private static boolean verificationCodeMatches(String expected, String provided) {
        String given = trimToNull(provided);
        if (expected == null || given == null) {
            return false;
        }
        return MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8), given.getBytes(StandardCharsets.UTF_8));
    }

    /** Sliding one-hour window per address; records the attempt when under the limit. */
    private boolean ipOverLimit(String clientIp, Instant now) {
        if (maxRequestsPerIpPerHour <= 0) {
            return false;
        }
        Instant cutoff = now.minus(1, ChronoUnit.HOURS);
        if (recentRequestsByIp.size() > MAX_TRACKED_IPS) {
            recentRequestsByIp.entrySet().removeIf(e -> {
                synchronized (e.getValue()) {
                    Instant last = e.getValue().peekLast();
                    return last == null || last.isBefore(cutoff);
                }
            });
        }
        Deque<Instant> times = recentRequestsByIp.computeIfAbsent(clientIp, ip -> new ArrayDeque<>());
        synchronized (times) {
            while (!times.isEmpty() && times.peekFirst().isBefore(cutoff)) {
                times.pollFirst();
            }
            if (times.size() >= maxRequestsPerIpPerHour) {
                return true;
            }
            times.addLast(now);
            return false;
        }
    }

    private String uniqueUsername(String fullName) {
        String base = fullName.toLowerCase(Locale.ROOT)
                .replaceAll("[ăâ]", "a").replace('î', 'i').replace('ș', 's').replace('ț', 't')
                .replaceAll("[^a-z0-9]+", "_")
                .replaceAll("^_+|_+$", "");
        if (base.isBlank()) {
            base = "user";
        }
        if (base.length() > 40) {
            base = base.substring(0, 40);
        }
        String candidate = base;
        int suffix = 2;
        while (employeeRepository.findByUsername(candidate).isPresent()) {
            candidate = base + "_" + suffix++;
        }
        return candidate;
    }

    private boolean setupCodeMatches(String provided) {
        String expected = setupCode;
        String given = trimToNull(provided);
        if (expected == null || given == null) {
            return false;
        }
        return MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                given.toUpperCase(Locale.ROOT).getBytes(StandardCharsets.UTF_8));
    }

    /** Crockford-ish alphabet: no O/0 or I/1 to misread off a terminal. */
    private String randomSetupCode() {
        final String alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder(9);
        for (int i = 0; i < 8; i++) {
            if (i == 4) {
                sb.append('-');
            }
            sb.append(alphabet.charAt(secureRandom.nextInt(alphabet.length())));
        }
        return sb.toString();
    }

    private String randomVerificationCode() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }

    private String randomSecret() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static String truncate(String value, int max) {
        if (value == null) {
            return null;
        }
        return value.length() <= max ? value : value.substring(0, max);
    }
}
