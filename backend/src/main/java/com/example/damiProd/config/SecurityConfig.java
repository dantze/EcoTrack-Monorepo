package com.example.damiProd.config;

import com.example.damiProd.service.TokenService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Wires up token-based auth for the API.
 *
 * IMPORTANT: {@code ecotrack.security.enforce} controls whether unauthenticated
 * requests to /api/** are rejected. It does NOT control whether the auth
 * machinery itself works - enrollment/refresh/logout/sessions always work, and
 * a valid bearer token is always honoured by {@link BearerTokenAuthenticationFilter}.
 * When the flag is false, /api/** simply stays open to anonymous requests too.
 * It now defaults to true (application.properties): every client obtains its
 * session through device enrollment, so there is no token-less caller left for
 * the open mode to protect.
 *
 * Two things deliberately apply in BOTH modes, because neither depends on the
 * caller being authenticated:
 *   - the infrastructure deny-list below (/h2-console, actuator internals):
 *     nothing in either client app ever calls those;
 *   - the security response headers.
 * Everything role-related is inside the {@code enforceSecurity} branch and is
 * therefore inert while the flag is false.
 *
 * See CLAUDE.md ("The security enforcement flag") for the full property list
 * and what an operator must do to flip this on.
 */
@Configuration
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    // Role names as stored in employee_roles (SecurityConfig prefixes ROLE_ itself
    // via hasRole/hasAnyRole - see BearerTokenAuthenticationFilter, which builds the
    // authorities as "ROLE_" + roleName).
    private static final String ADMIN = "ADMIN";
    private static final String SALES = "SALES";
    private static final String TECH = "TECH";
    private static final String DRIVER = "DRIVER";
    /** Office staff: everyone allowed to change business data (clients, orders, routes, ...). */
    private static final String[] OFFICE = { ADMIN, SALES, TECH };

    /**
     * Never routable, in either enforcement mode. The H2 console in particular is
     * an arbitrary-JDBC-URL client: reachable + unauthenticated means "connect to
     * any database this host can see", so it is denied at the filter chain as well
     * as switched off via spring.h2.console.enabled.
     */
    private static final String[] INFRA_DENY_LIST = {
            "/h2-console/**", "/actuator/**", "/env/**", "/heapdump", "/jolokia/**"
    };

    /**
     * The one actuator path that must stay reachable, in BOTH enforcement modes.
     *
     * The Docker healthcheck and the deploy workflow poll it, and docker-compose
     * gates Caddy on {@code service_healthy}. While this was swallowed by the
     * {@code /actuator/**} entry above, the container could never report healthy,
     * so the deploy timed out and the reverse proxy never started.
     *
     * Exposing it leaks nothing: application.properties exposes only the `health`
     * endpoint, with show-details=never and show-components=never, so the body is
     * exactly {"status":"UP"}. It MUST be matched before INFRA_DENY_LIST - the
     * first matching rule wins.
     */
    private static final String HEALTH_PROBE = "/actuator/health";

    private static final List<String> ALLOWED_CORS_HEADERS =
            List.of("Authorization", "Content-Type", "Accept", "Accept-Language", "X-Requested-With");

    @Value("${ecotrack.security.enforce:true}")
    private boolean enforceSecurity;

    @Value("${ecotrack.cors.allowed-origins:http://localhost:5173}")
    private String allowedOriginsProperty;

    @Value("${ecotrack.security.reject-invalid-bearer:true}")
    private boolean rejectInvalidBearer;

    @PostConstruct
    void logEnforcementMode() {
        // Deliberately loud: an operator must never be unsure which mode is live.
        log.info("====================================================================");
        if (enforceSecurity) {
            log.info("EcoTrack security ENFORCEMENT IS ON (ecotrack.security.enforce=true).");
            log.info("  -> /api/** requires a valid Bearer access token.");
            log.info("  -> /api/admin/** and employee management require the ADMIN role.");
            log.info("  -> business writes require SALES/TECH/ADMIN; DRIVER may only");
            log.info("     update task status and upload task photos.");
        } else {
            log.warn("EcoTrack security enforcement is OFF (ecotrack.security.enforce=false).");
            log.warn("  -> /api/** accepts unauthenticated requests (legacy/mobile compatibility mode).");
            log.warn("  -> Token issuance/validation still works; only the gate is open.");
            log.warn("  -> Role checks are INERT in this mode - anyone reaching the API is effectively admin.");
        }
        log.info("====================================================================");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOriginsProperty.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                // Fail closed: "*" cannot be combined with credentials, and silently
                // letting it through would be the one CORS mistake that matters.
                .filter(s -> {
                    if ("*".equals(s)) {
                        log.error("ecotrack.cors.allowed-origins contains '*', which is not allowed with "
                                + "credentialed requests - ignoring that entry.");
                        return false;
                    }
                    return true;
                })
                .toList();
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Explicit list rather than "*": with allowCredentials=true a browser will
        // not honour "*" anyway, and an explicit list documents the contract.
        configuration.setAllowedHeaders(ALLOWED_CORS_HEADERS);
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, TokenService tokenService,
            CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // This is a pure JSON API: nothing here is ever meant to be framed,
                // embedded, sniffed as another content type, or cached by a shared proxy.
                .headers(headers -> headers
                        .frameOptions(frame -> frame.deny())
                        .contentTypeOptions(Customizer.withDefaults())
                        .cacheControl(Customizer.withDefaults())
                        .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.DISABLED))
                        .referrerPolicy(referrer -> referrer
                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
                        // No document this API serves is allowed to load anything or be
                        // framed; this mainly neuters any error page or accidental HTML.
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"))
                        // Ignored over plain HTTP (which is what production still speaks),
                        // but correct the moment TLS is terminated in front of the app.
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000)))
                .addFilterBefore(new BearerTokenAuthenticationFilter(tokenService, rejectInvalidBearer),
                        UsernamePasswordAuthenticationFilter.class)
                // Plain status codes, no redirect-to-login-page: this is a token API,
                // never an HTML login flow.
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                response.sendError(HttpServletResponse.SC_FORBIDDEN)));

        if (enforceSecurity) {
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers(HEALTH_PROBE).permitAll()
                    .requestMatchers(INFRA_DENY_LIST).denyAll()
                    // The ONLY unauthenticated surface. A device has no credential
                    // until an admin approves it, so asking and collecting must be
                    // reachable; /login and /google are gone with passwords and
                    // Google sign-in.
                    .requestMatchers(HttpMethod.GET, "/api/enrollment/status").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/enrollment/request", "/api/enrollment/claim")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/refresh", "/api/auth/logout")
                    .permitAll()
                    // /auth/me + session management: any signed-in employee manages
                    // their own sessions, regardless of role.
                    .requestMatchers("/api/auth/**").authenticated()

                    // ---- Administration -------------------------------------------------
                    .requestMatchers("/api/admin/**").hasRole(ADMIN)
                    // EmployeeController writes are an unguarded privilege-escalation path
                    // (create an employee, hand it any role) - admins only.
                    .requestMatchers(HttpMethod.POST, "/api/employees", "/api/employees/**").hasRole(ADMIN)
                    .requestMatchers(HttpMethod.PUT, "/api/employees/**").hasRole(ADMIN)
                    .requestMatchers(HttpMethod.PATCH, "/api/employees/**").hasRole(ADMIN)
                    .requestMatchers(HttpMethod.DELETE, "/api/employees/**").hasRole(ADMIN)

                    // ---- Field work -----------------------------------------------------
                    // The only two writes the driver app performs (see mobile/app/Driver/*):
                    // marking a task done and attaching its photos.
                    //
                    // Since TODO-33 that is a checked fact rather than a claim. Mobile is
                    // the driver experience and nothing else - its Sales and Technical
                    // sections were deleted - and its whole API surface is declared in
                    // .github/scripts/cross_project_invariants.py, which runs on every PR.
                    // A new mobile call fails there until it is declared, and if it is a
                    // write it needs a row HERE, above the office catch-alls below.
                    .requestMatchers(HttpMethod.PATCH, "/api/tasks/*/status")
                    .hasAnyRole(DRIVER, SALES, TECH, ADMIN)
                    .requestMatchers(HttpMethod.POST, "/api/tasks/*/photos")
                    .hasAnyRole(DRIVER, SALES, TECH, ADMIN)

                    // ---- Every other business write is office staff ---------------------
                    .requestMatchers(HttpMethod.POST, "/api/**").hasAnyRole(OFFICE)
                    .requestMatchers(HttpMethod.PUT, "/api/**").hasAnyRole(OFFICE)
                    .requestMatchers(HttpMethod.PATCH, "/api/**").hasAnyRole(OFFICE)
                    .requestMatchers(HttpMethod.DELETE, "/api/**").hasAnyRole(OFFICE)

                    // ---- Reads: any authenticated employee ------------------------------
                    // Reads are office data by default (TODO-116). A driver used to
                    // GET everything here - every client's CNP, phone and e-mail,
                    // every order, every employee - because this row was
                    // authenticated(). The driver app reads exactly two trees, and
                    // both are row-scoped in their controllers by TaskAccessPolicy.
                    // A new driver read needs a row HERE, above the office default.
                    .requestMatchers(HttpMethod.GET, "/api/tasks/**", "/api/routes/employee/**")
                    .authenticated()
                    .requestMatchers("/api/**").hasAnyRole(OFFICE)

                    // Container-generated error dispatches must stay reachable, or a 401
                    // would turn into a 403 loop.
                    .requestMatchers("/error").permitAll()
                    .anyRequest().denyAll());
        } else {
            // Enforcement off: the business API stays open, but the filter above still
            // populates the SecurityContext for anyone who *does* send a token, so web
            // clients can already rely on auth working end-to-end. The infrastructure
            // deny-list still applies - no client has ever called those paths.
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers(HEALTH_PROBE).permitAll()
                    .requestMatchers(INFRA_DENY_LIST).denyAll()
                    .anyRequest().permitAll());
        }

        return http.build();
    }
}
