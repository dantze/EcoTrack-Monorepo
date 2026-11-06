/**
 * EnrollmentController — /api/enrollment  and  AdminEnrollmentController —
 * /api/admin/enrollment
 *
 * The only unauthenticated endpoints in the app. A device asks for access, an
 * admin approves it and picks a role, and the device exchanges a one-time
 * secret for tokens. See backend `EnrollmentService` for what each field
 * protects.
 *
 * The claim endpoint answers with STATUS CODES rather than an envelope, and
 * three of them are ordinary outcomes rather than faults:
 *   202  still pending — the waiting screen polls on this
 *   403  an admin rejected it
 *   410  the window closed, or the secret was already spent
 *   404  unknown request id OR wrong secret (deliberately indistinguishable)
 * All four are caught and returned as values; anything else is a real fault
 * and propagates.
 */

import type {
  AccessRequest,
  AccessRequestStatus,
  ApproveRequestInput,
  AuthSession,
  ClaimResult,
  EnrollmentApi,
  EnrollmentRequestInput,
  EnrollmentStatus,
  EnrollmentTicket,
} from '../contract';
import type { AuthUser, Role } from '@/types/domain';
import { num, optStr } from './normalize';
import { ApiError, request } from '../http';

interface RawUser {
  id?: number;
  username?: string;
  fullName?: string;
  phone?: string | null;
  county?: string | null;
  email?: string | null;
  roles?: string[] | null;
}

interface RawClaimEnvelope {
  success?: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: RawUser;
}

interface RawAccessRequest {
  id: number;
  fullName?: string;
  deviceLabel?: string | null;
  status?: string;
  createdAt?: string;
  expiresAt?: string;
  assignedRoleName?: string | null;
}

function normalizeUser(raw: RawUser): AuthUser {
  return {
    id: num(raw.id),
    username: raw.username ?? '',
    fullName: raw.fullName ?? '',
    phone: optStr(raw.phone),
    county: optStr(raw.county),
    email: optStr(raw.email),
    roles: Array.isArray(raw.roles) ? (raw.roles.map((r) => r.toUpperCase()) as Role[]) : [],
  };
}

function normalizeRequest(raw: RawAccessRequest): AccessRequest {
  return {
    id: num(raw.id),
    fullName: raw.fullName ?? '',
    deviceLabel: optStr(raw.deviceLabel),
    status: (raw.status ?? 'PENDING') as AccessRequestStatus,
    createdAt: raw.createdAt ?? '',
    expiresAt: raw.expiresAt ?? '',
    assignedRoleName: raw.assignedRoleName ? (raw.assignedRoleName.toUpperCase() as Role) : null,
  };
}

export const enrollmentApi: EnrollmentApi = {
  async status(): Promise<EnrollmentStatus> {
    const raw = await request<{
      awaitingBootstrap?: boolean;
      setupCodeRequired?: boolean;
      adminLockout?: boolean;
    }>('/enrollment/status');
    return {
      awaitingBootstrap: raw.awaitingBootstrap ?? false,
      setupCodeRequired: raw.setupCodeRequired ?? false,
      adminLockout: raw.adminLockout ?? false,
    };
  },

  async request(input: EnrollmentRequestInput): Promise<EnrollmentTicket> {
    const raw = await request<{
      requestId: number;
      claimSecret: string;
      verificationCode: string;
      expiresAt: string;
      autoApproved?: boolean;
    }>('/enrollment/request', {
      method: 'POST',
      body: {
        fullName: input.fullName,
        deviceId: input.deviceId,
        deviceLabel: input.deviceLabel ?? null,
        setupCode: input.setupCode ?? null,
      },
    });
    return {
      requestId: num(raw.requestId),
      claimSecret: raw.claimSecret,
      verificationCode: raw.verificationCode,
      expiresAt: raw.expiresAt,
      autoApproved: raw.autoApproved ?? false,
    };
  },

  async claim(requestId: number, claimSecret: string): Promise<ClaimResult> {
    let raw: RawClaimEnvelope;
    try {
      raw = await request<RawClaimEnvelope>('/enrollment/claim', {
        method: 'POST',
        body: { requestId, claimSecret },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 202) return { state: 'pending' };
        if (error.status === 403) return { state: 'rejected', message: 'Cererea a fost respinsă' };
        if (error.status === 410) {
          return { state: 'expired', message: 'Cererea a expirat. Trimite o cerere nouă.' };
        }
        if (error.status === 404) {
          return { state: 'unknown', message: 'Cererea nu a fost găsită' };
        }
      }
      throw error;
    }

    if (!raw.accessToken || !raw.refreshToken || !raw.user) {
      // A 202 that http.ts treated as success still lands here.
      return { state: 'pending' };
    }
    const session: AuthSession = {
      user: normalizeUser(raw.user),
      tokens: {
        accessToken: raw.accessToken,
        refreshToken: raw.refreshToken,
        expiresIn: raw.expiresIn ?? 1800,
      },
    };
    return { state: 'issued', session };
  },

  async listRequests(): Promise<AccessRequest[]> {
    const raw = await request<RawAccessRequest[]>('/admin/enrollment/requests');
    return (raw ?? []).map(normalizeRequest);
  },

  async approve(id: number, input: ApproveRequestInput): Promise<void> {
    await request<unknown>(`/admin/enrollment/requests/${id}/approve`, {
      method: 'POST',
      body: {
        roleName: input.role,
        verificationCode: input.verificationCode,
        employeeId: input.employeeId,
      },
    });
  },

  async reject(id: number): Promise<void> {
    await request<unknown>(`/admin/enrollment/requests/${id}/reject`, { method: 'POST' });
  },
};
