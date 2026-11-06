# Two definitions of done

Moved out of `CLAUDE.md` so it is read only when relevant. Section headings are
unchanged, so a code comment that cites a CLAUDE.md section still finds its
text here — `CLAUDE.md`'s *Deeper reading* table maps each heading to this file.

## Two definitions of "done", on purpose

An order's "is the work finished?" question has **two** answers in this repo and
they deliberately disagree. Picking the wrong one is a silent bug, so pick
consciously.

**The strict rule — `isOrderFulfilled` in `web/src/features/sales/orderModel.ts`:
an order is finished iff it has a COMPLETED task, and nothing else.** An order
with no task has certainly not been carried out, so it stays current even when
its date is long past. A status that is missing or still loading also reads as
unfinished — an order only leaves the operator's list on positive evidence.

The backend enforces the **same** rule in
`OrderRepository.findLiveBySubscriptionId`, whose JPQL is a
`NOT EXISTS (… task.status = 'COMPLETED')`: that is what refuses to retire a
subscription while live orders still point at it. Two implementations, one rule
— **change one and you must change the other**, or the archive and the guard
will disagree about the same order.

`countLiveByProductId` in the same repository is the third, and it is the same
`NOT EXISTS` for the same reason: **retiring a product is now a soft delete too**
(TODO-38), so a finished order keeps resolving its name and price through the
surviving row and no longer blocks. Produse and Abonamente are one rule now,
where they used to be two — the product delete was hard, which forced it to block
on *any* reference and meant a product sold once could never leave the catalogue.
`SubscriptionService.moveOrders` (TODO-37) is the fourth caller of the same
definition. All four move together.

`findLiveByProductId` is `countLiveByProductId` with the rows kept instead of
counted (TODO-57) — the count refuses the delete, the list is what
`GET /api/products/{id}/usage` names in the dialog explaining it. **One
predicate, written twice**, so a refusal that counted three orders cannot open a
dialog showing two; `FulfilmentRuleTest` runs both against every case in the
shared fixture. `GET /api/subscriptions/{id}/usage` is the same arrangement on
the subscription side.

Both are roll-ups over **all** of an order's tasks, because an order is not
limited to one: `TaskService.summariseOrderTasks` is what
`GET /api/tasks/order/{id}/exists` reports, and it answers COMPLETED whenever any
task is (TODO-34). **`shared/fulfilment-cases.json` is what holds the three sides
to the same answers** — the backend suite and the web suite both read that one
file, so a case added there fails whichever side does not follow it. Change the
rule by changing the fixture first.

This strict rule drives the **Curente / Arhivă** split on Comenzi. Nothing
archives or un-archives by hand: the state is derived, so an order leaves Arhivă
exactly when its task stops being COMPLETED.

**The lenient rule — `deriveLifecycle` in `web/src/features/map/data.ts`:** task
evidence first, then a **fallback to date reasoning** when an order has no
conclusive task, which will call a task-less past-dated order `'done'`. That is
fine for colouring a map pin and wrong for a guard or an archive, which have to
fail safe. Do not "unify" the two, and do not reach for `deriveLifecycle` when
the answer gates a write or hides a row.

A third, unrelated definition: the Comenzi table, the calendar and the day
drawer all place an order on **`orderPrimaryDate`** (start / pickup / sanitation
date) — one shared definition of *when*, so the table and the calendar can never
disagree about which day an order belongs to.

