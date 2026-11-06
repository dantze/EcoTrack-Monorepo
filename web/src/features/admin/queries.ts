/**
 * Server state for the Admin module.
 *
 * Namespaced under 'admin' like the other modules, so invalidating the root
 * key refreshes both the request queue and the employee roster — which matters
 * because approving a request CREATES an employee, so the two are never
 * independent.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { api } from '@/api';
import type { AccessRequest, ApproveRequestInput, SessionDevice } from '@/api/contract';
import type { Employee, Role } from '@/types/domain';

export const keys = {
  root: ['admin'] as const,
  requests: () => ['admin', 'requests'] as const,
  employees: () => ['admin', 'employees'] as const,
  /**
   * Nested under `employees()` so a role change — which revokes that person's
   * sessions server-side — invalidates their device list along with the roster.
   */
  sessions: (employeeId: number) => ['admin', 'employees', employeeId, 'sessions'] as const,
};

/**
 * The pending queue. Polled: a request arrives while the admin is already
 * looking at the screen, and it expires on its own after ten minutes, so a
 * stale list is actively misleading here.
 */
export function useAccessRequests(): UseQueryResult<AccessRequest[]> {
  return useQuery({
    queryKey: keys.requests(),
    queryFn: () => api.enrollment.listRequests(),
    refetchInterval: 5000,
  });
}

export function useApproveRequest(): UseMutationResult<
  void,
  unknown,
  { id: number } & ApproveRequestInput
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }) => api.enrollment.approve(id, input),
    // Approval creates the Employee, so the roster is dirty too.
    onSuccess: () => client.invalidateQueries({ queryKey: keys.root }),
  });
}

export function useRejectRequest(): UseMutationResult<void, unknown, number> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.enrollment.reject(id),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.requests() }),
  });
}

export function useAllEmployees(): UseQueryResult<Employee[]> {
  return useQuery({
    queryKey: keys.employees(),
    queryFn: () => api.employees.list(),
  });
}

export function useSetEmployeeRoles(): UseMutationResult<
  Employee,
  unknown,
  { id: number; roles: Role[] }
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roles }) => api.employees.update(id, { roles }),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.root }),
  });
}

export function useRemoveEmployee(): UseMutationResult<void, unknown, number> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.employees.remove(id),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.root }),
  });
}

// ---------------------------------------------------------------------------
// Somebody else's devices (TODO-56)
// ---------------------------------------------------------------------------

/**
 * The devices one employee is signed in on. Admin-only: everything under
 * `api.auth` is scoped to the caller, so this is the only way an admin ends a
 * lost phone's session without changing that person's role or deleting them.
 *
 * `enabled` because the dialog is what asks — there is no reason to fetch ten
 * employees' device lists to render a roster.
 */
export function useEmployeeSessions(
  employeeId: number,
  enabled: boolean,
): UseQueryResult<SessionDevice[]> {
  return useQuery({
    queryKey: keys.sessions(employeeId),
    queryFn: () => api.employees.listSessions(employeeId),
    enabled,
  });
}

export function useRevokeEmployeeSession(): UseMutationResult<
  void,
  unknown,
  { employeeId: number; sessionId: string }
> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, sessionId }) => api.employees.revokeSession(employeeId, sessionId),
    onSuccess: (_result, { employeeId }) =>
      client.invalidateQueries({ queryKey: keys.sessions(employeeId) }),
  });
}

/** Resolves to how many devices were signed out — 0 means it was already dead. */
export function useRevokeAllEmployeeSessions(): UseMutationResult<number, unknown, number> {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (employeeId) => api.employees.revokeAllSessions(employeeId),
    onSuccess: (_result, employeeId) =>
      client.invalidateQueries({ queryKey: keys.sessions(employeeId) }),
  });
}
