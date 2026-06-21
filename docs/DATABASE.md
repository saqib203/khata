# Database Schema

The PostgreSQL schema is defined in `infra/postgres/init/001_schema.sql`.

## Design Notes

- Financial values use `numeric(18, 2)`.
- Inventory quantities use `numeric(18, 3)` to support fractional units if needed.
- Customer and supplier ledgers are append-only through `ledger_entries`.
- Customer smart search uses PostgreSQL trigram indexes.
- Every operational table includes timestamp metadata and soft-delete support where relevant.
- `activity_logs` record user activity; `audit_logs` record data changes.

## Critical Balance Rules

Sale balance:

```text
balance_amount = total - paid_amount
```

Customer ledger:

```text
sale created       => debit total
payment received  => credit payment amount
```

Supplier ledger:

```text
purchase created  => credit total
payment paid      => debit payment amount
```

Inventory valuation:

```text
inventory_value = quantity_on_hand * average_cost
```

Pump profit:

```text
profit = sale_price - material_cost - labor_cost
```
