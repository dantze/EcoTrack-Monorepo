package com.example.damiProd.ControllerTests;

import com.example.damiProd.controller.RouteController;
import com.example.damiProd.domain.Employee;
import com.example.damiProd.domain.Route;
import com.example.damiProd.service.RouteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import com.example.damiProd.service.TaskAccessPolicy;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RouteController.class)
// Security filters are disabled in this slice: this test targets controller/service
// wiring, not auth. @WebMvcTest does not pick up the app's own SecurityConfig, so
// without this the default Spring Boot Security auto-config would 401 everything.
@AutoConfigureMockMvc(addFilters = false)
class RouteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RouteService routeService;

    // Its void guards no-op as a mock; who may read whose routes is asserted in
    // SecurityTests/AuthHardeningTest against the real chain.
    @MockitoBean
    private TaskAccessPolicy accessPolicy;

    // -----------------------------------------------------------------------
    // Helper
    // -----------------------------------------------------------------------
    private Route buildSampleRoute() {
        Employee driver = new Employee("driver1", "Ion Șofer", "0711000000");
        driver.setId(5L);

        Route route = new Route("Ruta Cluj Nord", 2, "Cluj", driver);
        route.setId(10L);
        route.setDayOfWeek(2); // Tuesday
        return route;
    }

    // -----------------------------------------------------------------------
    // TEST 1 — GET /api/routes → all routes
    // -----------------------------------------------------------------------
    @Test
    void getAllRoutes_shouldReturn200() throws Exception {
        Route route = buildSampleRoute();
        when(routeService.getAllRoutes()).thenReturn(List.of(route));

        mockMvc.perform(get("/api/routes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10))
                .andExpect(jsonPath("$[0].name").value("Ruta Cluj Nord"));
    }

    // -----------------------------------------------------------------------
    // TEST 2 — POST /api/routes → create route
    // -----------------------------------------------------------------------
    @Test
    void createRoute_shouldReturn200() throws Exception {
        Route route = buildSampleRoute();
        when(routeService.createRoute(any())).thenReturn(route);

        String body = """
                {
                    "name": "Ruta Cluj Nord",
                    "date": "2025-07-01",
                    "dayOfWeek": 2,
                    "county": "Cluj",
                    "employeeId": 5
                }
                """;

        mockMvc.perform(post("/api/routes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Ruta Cluj Nord"))
                .andExpect(jsonPath("$.county").value("Cluj"));
    }

    // -----------------------------------------------------------------------
    // TEST 3 — GET /api/routes/{id} → get route by ID
    // -----------------------------------------------------------------------
    @Test
    void getRouteById_shouldReturn200() throws Exception {
        Route route = buildSampleRoute();
        when(routeService.getRouteById(10L)).thenReturn(route);

        mockMvc.perform(get("/api/routes/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.employeeId").value(5));
    }

    // -----------------------------------------------------------------------
    // TEST 4 — DELETE /api/routes/{id} → delete route returns 204
    // -----------------------------------------------------------------------
    @Test
    void deleteRoute_shouldReturn204() throws Exception {
        doNothing().when(routeService).deleteRoute(10L);

        mockMvc.perform(delete("/api/routes/10"))
                .andExpect(status().isNoContent());

        verify(routeService).deleteRoute(10L);
    }

    // -----------------------------------------------------------------------
    // TEST 5 — GET /api/routes/employee/{employeeId} → routes by employee
    // -----------------------------------------------------------------------
    @Test
    void getRoutesByEmployee_shouldReturn200() throws Exception {
        Route route = buildSampleRoute();
        when(routeService.getRoutesByEmployeeId(5L)).thenReturn(List.of(route));

        mockMvc.perform(get("/api/routes/employee/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].employeeName").value("Ion Șofer"));
    }

    // -----------------------------------------------------------------------
    // TEST 6 — GET /api/routes/employee/{id}/day/{dayOfWeek} → filter by weekday
    // -----------------------------------------------------------------------
    @Test
    void getRoutesByEmployeeAndDay_shouldReturn200() throws Exception {
        // Weekday, not date: a route recurs every week, so there is no single
        // calendar day to ask for.
        Route route = buildSampleRoute();
        when(routeService.getRoutesByEmployeeIdAndDayOfWeek(5L, 2)).thenReturn(List.of(route));

        mockMvc.perform(get("/api/routes/employee/5/day/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dayOfWeek").value(2));
    }

    // -----------------------------------------------------------------------
    // TEST 7 — PUT /api/routes/{routeId}/assign-driver/{employeeId}
    // -----------------------------------------------------------------------
    @Test
    void assignDriverToRoute_shouldReturn200() throws Exception {
        Route route = buildSampleRoute();
        when(routeService.assignDriverToRoute(10L, 5L)).thenReturn(route);

        mockMvc.perform(put("/api/routes/10/assign-driver/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId").value(5))
                .andExpect(jsonPath("$.employeeName").value("Ion Șofer"));
    }
}
