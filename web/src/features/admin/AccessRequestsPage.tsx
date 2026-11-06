/**
 * Cereri de acces — the admin's approval queue.
 *
 * This screen is the entire access-control system: nobody gets into EcoTrack
 * except through a row here. Two things on it carry real weight:
 *
 *   - The SIX-DIGIT CODE is on the requester's screen and NOT on this one
 *     (TODO-116). The admin types what the person reads out, and the server
 *     refuses a mismatch. It used to be shown here, which made checking it
 *     optional — and approving by name alone is what lets an attacker be
 *     approved in someone else's name.
 *   - WHO the device becomes: a new employee with the chosen role, or an
 *     existing one (a new phone, a revoked device). Re-enrolling someone as
 *     "new" used to mint a duplicate person with none of their routes.
 *
 * Requests expire on their own (ten minutes), so the list polls and shows a
 * live countdown — a stale queue here is actively misleading.
 */

import { useState } from 'react';
import type { AccessRequest } from '@/api/contract';
import { CommandBar, Workbench, WorkbenchBody } from '@/components/layout';
import { serverMessage } from '@/api';
import { Badge, Button, EmptyState, Select, Spinner, TextInput, useToast } from '@/components/ui';
import { ROLE_LABELS } from '@/components/domain';
import type { Role } from '@/types/domain';
import { useAccessRequests, useAllEmployees, useApproveRequest, useRejectRequest } from './queries';

/**
 * Roles an admin may grant, driver first because it is the common case.
 * Mirrors the backend's assignable set exactly — approving anything outside it
 * is rejected server-side.
 */
const ASSIGNABLE: Role[] = ['DRIVER', 'SALES', 'TECH', 'ADMIN'];

function remaining(expiresAt: string): string | null {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return null;
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Sentinel for "create a new employee" in the person picker. */
const NEW_EMPLOYEE = 'new';

function RequestCard({ request }: { request: AccessRequest }) {
  const [role, setRole] = useState<Role>('DRIVER');
  const [person, setPerson] = useState<string>(NEW_EMPLOYEE);
  const [code, setCode] = useState('');
  const employees = useAllEmployees();
  const approve = useApproveRequest();
  const reject = useRejectRequest();
  const toast = useToast();
  const busy = approve.isPending || reject.isPending;
  const countdown = remaining(request.expiresAt);
  const decided = request.status !== 'PENDING';
  const existing = person === NEW_EMPLOYEE ? null : (employees.data ?? []).find((e) => String(e.id) === person);
  const codeComplete = /^\d{6}$/.test(code);

  return (
    <li className="rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-medium text-ink">{request.fullName}</p>
          <p className="mt-0.5 text-sm text-ink-muted">
            {request.deviceLabel ?? 'Dispozitiv necunoscut'}
          </p>
        </div>

        <p className="text-right text-xs text-ink-muted">
          {decided ? 'Aprobat — se așteaptă dispozitivul' : `Expiră în ${countdown ?? '0:00'}`}
        </p>
      </div>

      {decided ? (
        <div className="mt-4">
          <Badge tone="info">
            {request.assignedRoleName ? ROLE_LABELS[request.assignedRoleName] : 'Aprobat'}
          </Badge>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <TextInput
            label="Codul persoanei"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="off"
            placeholder="6 cifre"
            fieldClassName="w-36"
            className="font-mono tracking-[0.2em]"
          />

          {/* The kit's Select field is full-width; the box sets its width in the row. */}
          <div className="w-52">
            <Select
              label="Persoană"
              value={person}
              onChange={setPerson}
              searchable
              options={[
                { value: NEW_EMPLOYEE, label: 'Angajat nou' },
                ...(employees.data ?? []).map((e) => ({ value: String(e.id), label: e.fullName })),
              ]}
            />
          </div>

          {existing ? null : (
            <div className="w-36">
              <Select
                label="Rol"
                value={role}
                onChange={(next) => setRole(next as Role)}
                options={ASSIGNABLE.map((option) => ({ value: option, label: ROLE_LABELS[option] }))}
              />
            </div>
          )}

          {/*
            Explicitly primary. `Button` defaults to `secondary`, and this is
            the one action the screen exists for — approving a device — sitting
            next to a ghost "Respinge". Without the variant it rendered as a
            quiet bordered button, indistinguishable in weight from the reject
            beside it.
          */}
          <Button
            variant="primary"
            disabled={busy || !codeComplete}
            onClick={() =>
              approve.mutate(
                existing
                  ? { id: request.id, verificationCode: code, employeeId: existing.id }
                  : { id: request.id, verificationCode: code, role },
                {
                  onSuccess: () =>
                    toast.success(
                      existing
                        ? `Dispozitivul a fost asociat cu ${existing.fullName}.`
                        : `${request.fullName} a primit rolul ${ROLE_LABELS[role]}.`,
                    ),
                  onError: (error) => toast.error(serverMessage(error) ?? 'Aprobarea a eșuat.'),
                },
              )
            }
          >
            Aprobă
          </Button>

          <Button
            variant="ghost"
            disabled={busy}
            onClick={() =>
              reject.mutate(request.id, {
                onSuccess: () => toast.success('Cererea a fost respinsă.'),
                onError: () => toast.error('Respingerea a eșuat.'),
              })
            }
          >
            Respinge
          </Button>
        </div>
      )}
    </li>
  );
}

export function AccessRequestsPage() {
  const { data, isLoading } = useAccessRequests();
  const requests = data ?? [];

  return (
    <Workbench>
      <CommandBar
        title="Cereri de acces"
        subtitle={
          isLoading
            ? 'Se încarcă…'
            : `${requests.length} în așteptare · cere-i persoanei codul de pe ecranul ei, apoi alege cine este`
        }
      />

      <WorkbenchBody>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            title="Nicio cerere în așteptare"
            body="Cererile apar aici imediat ce cineva deschide aplicația și cere acces."
          />
        ) : (
          <ul className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </ul>
        )}
      </WorkbenchBody>
    </Workbench>
  );
}
