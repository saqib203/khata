# PumpERP Product Requirements Document

## Mission

Build a complete enterprise-grade cloud ERP that replaces paper khata books for a water pump business. The system must synchronize securely across web, Android, iOS, and tablet devices in a Gmail-style cloud experience.

## Business Context

The business purchases parts, manufactures and repairs pumps, sells pumps to customers, receives installments, manages suppliers, tracks inventory, and maintains financial records.

## Users

- Owner: full access, profit, reports, settings, audit trail.
- Accountant: payments, ledgers, statements, reports.
- Manager: customers, suppliers, inventory, pumps, sales.
- Workshop staff: pump production status, parts usage, labor cost.
- Sales staff: customer lookup, invoices, payment receipts.

## Product Principles

- Cloud-first with automatic sync and backup.
- Ledger accuracy is more important than UI convenience.
- Every financial change must be auditable.
- Offline mobile work must reconcile safely when back online.
- Search must be fast enough for counter-style customer lookup.

## Core Modules

### Authentication and Security

- Login, logout, email verification, forgot/reset/change password.
- JWT access tokens, refresh tokens, session management.
- Multi-device login and device tracking.
- Role-based access control with granular permissions.
- Activity logs for user actions and audit logs for data changes.

### Dashboard

Display totals for customers, suppliers, pumps, sales, purchases, receivables, payables, profit, inventory value, recent transactions, recent payments, top customers, and top suppliers.

### Customer Management

Store customer identity, mobile and WhatsApp numbers, CNIC, address, city, notes, status, and registration date. The customer profile must show total sales, payments received, outstanding balance, pumps purchased, last transaction, last payment, complete ledger, and full history.

Smart search must instantly surface the customer profile, balance, history, pending payments, invoices, and purchased pumps.

### Supplier Management

Store supplier contact information, purchase history, total purchases, total paid, outstanding amount, complete ledger, and last transaction.

### Inventory Management

Track motors, bearings, shafts, impellers, casings, and accessories. Support stock in, stock out, adjustments, valuation, history, low-stock alerts, and transfers.

### Pump Production

Track pump name, type, customer, supplier, parts used, labor cost, material cost, total cost, sale price, profit, start date, completion date, and status. Status values are pending, under work, ready, and delivered.

### Sales

Create invoices, select customer and products, track payments and installments, calculate balances automatically, print invoices, and share invoices.

### Khata Ledgers

Maintain customer and supplier ledgers with debit, credit, balance, date-wise filters, customer and supplier filters, and amount filters.

### Payments

Support cash, bank transfer, Easypaisa, and JazzCash. Generate receipts, track payment history, and create due payment reminders.

### Reports

Generate daily, weekly, monthly, yearly, customer statement, supplier statement, sales, purchase, inventory, and profit and loss reports. Export PDF and Excel.

### Notifications

Notify users about customer payment due, supplier payment due, pending pumps, inventory alerts, new customers, and new sales.

### Mobile App

Provide splash, login, dashboard, customers, suppliers, inventory, pumps, sales, payments, reports, and settings. Support offline mode, background sync, push notifications, and fast search.

### Web Application

Provide the same business modules in an enterprise ERP layout with responsive light and dark mode.

## Non-Functional Requirements

- PostgreSQL is the system of record.
- Redis is used for caching, rate limiting, and distributed locks.
- All primary tables include soft delete, created/updated timestamps, and created/modified user references.
- API responses use stable DTOs rather than exposing persistence entities.
- Financial calculations use decimal values and server-side validation.
- Every mutation that affects balances records a ledger entry.
- Audit logs are append-only.
- Test target is 90%+ for critical domain, application, and API behavior.

## Success Criteria

- Owner can see real-time receivable, payable, inventory, and profit health.
- Staff can search a customer and immediately understand balance and pump history.
- Installment balances calculate automatically and cannot drift from ledger history.
- Purchases, stock usage, and pump production costs are traceable.
- Reports can be exported for daily operations and accounting.
