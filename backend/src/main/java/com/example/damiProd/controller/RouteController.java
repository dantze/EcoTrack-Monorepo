package com.example.damiProd.controller;

import com.example.damiProd.config.EmployeePrincipal;
import com.example.damiProd.service.TaskAccessPolicy;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.example.damiProd.domain.Route;
import com.example.damiProd.dto.CreateRouteRequest;
import com.example.damiProd.service.RouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;
    private final TaskAccessPolicy accessPolicy;

    public RouteController(RouteService routeService, TaskAccessPolicy accessPolicy) {
        this.routeService = routeService;
        this.accessPolicy = accessPolicy;
    }

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @PostMapping
    public ResponseEntity<Route> createRoute(@RequestBody CreateRouteRequest request) {
        Route savedRoute = routeService.createRoute(request);
        return ResponseEntity.ok(savedRoute);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }

    // Get a specific route by ID (with tasks)
    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id) {
        Route route = routeService.getRouteById(id);
        return ResponseEntity.ok(route);
    }

    // Get all routes for a specific employee (driver)
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Route>> getRoutesByEmployee(
            @AuthenticationPrincipal EmployeePrincipal principal,
            @PathVariable Long employeeId) {
        // The driver app's one route read: a driver may ask only for their own.
        accessPolicy.requireCanReadTasksOf(principal, employeeId);
        List<Route> routes = routeService.getRoutesByEmployeeId(employeeId);
        return ResponseEntity.ok(routes);
    }

    // Routes a specific employee drives on a given weekday (1 = Monday ... 7 = Sunday).
    // Weekday rather than date: a route recurs weekly, it is not scheduled per day.
    @GetMapping("/employee/{employeeId}/day/{dayOfWeek}")
    public ResponseEntity<List<Route>> getRoutesByEmployeeAndDay(
            @AuthenticationPrincipal EmployeePrincipal principal,
            @PathVariable Long employeeId,
            @PathVariable Integer dayOfWeek) {
        accessPolicy.requireCanReadTasksOf(principal, employeeId);
        List<Route> routes = routeService.getRoutesByEmployeeIdAndDayOfWeek(employeeId, dayOfWeek);
        return ResponseEntity.ok(routes);
    }

    // Assign a driver to a route
    @PutMapping("/{routeId}/assign-driver/{employeeId}")
    public ResponseEntity<Route> assignDriverToRoute(
            @PathVariable Long routeId,
            @PathVariable Long employeeId) {
        Route updatedRoute = routeService.assignDriverToRoute(routeId, employeeId);
        return ResponseEntity.ok(updatedRoute);
    }

    // Reorder tasks within a route
    @PutMapping("/{routeId}/reorder-tasks")
    public ResponseEntity<Route> reorderTasks(
            @PathVariable Long routeId,
            @RequestBody List<Long> taskIds) {
        Route updatedRoute = routeService.reorderTasks(routeId, taskIds);
        return ResponseEntity.ok(updatedRoute);
    }
}