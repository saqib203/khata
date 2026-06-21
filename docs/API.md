# PumpERP API Contract

Base path: `/api/v1`

## Auth

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/change-password`
- `GET /auth/sessions`
- `DELETE /auth/sessions/{sessionId}`

## Dashboard

- `GET /dashboard/summary`
- `GET /dashboard/recent-transactions`
- `GET /dashboard/top-customers`
- `GET /dashboard/top-suppliers`

## Customers

- `GET /customers?search=&status=&page=&pageSize=`
- `POST /customers`
- `GET /customers/{id}`
- `PUT /customers/{id}`
- `DELETE /customers/{id}`
- `GET /customers/{id}/profile`
- `GET /customers/{id}/ledger`
- `GET /customers/{id}/sales`
- `GET /customers/{id}/payments`
- `GET /customers/{id}/pumps`
- `GET /customers/search/smart?term=`

## Suppliers

- `GET /suppliers?search=&page=&pageSize=`
- `POST /suppliers`
- `GET /suppliers/{id}`
- `PUT /suppliers/{id}`
- `DELETE /suppliers/{id}`
- `GET /suppliers/{id}/profile`
- `GET /suppliers/{id}/ledger`
- `GET /suppliers/{id}/purchases`

## Inventory

- `GET /inventory/items?search=&category=&page=&pageSize=`
- `POST /inventory/items`
- `GET /inventory/items/{id}`
- `PUT /inventory/items/{id}`
- `POST /inventory/stock-in`
- `POST /inventory/stock-out`
- `POST /inventory/adjustments`
- `GET /inventory/items/{id}/history`
- `GET /inventory/alerts/low-stock`

## Pumps

- `GET /pumps?status=&customerId=&page=&pageSize=`
- `POST /pumps`
- `GET /pumps/{id}`
- `PUT /pumps/{id}`
- `POST /pumps/{id}/parts`
- `PATCH /pumps/{id}/status`
- `GET /pumps/{id}/costing`

## Sales

- `GET /sales?customerId=&status=&from=&to=&page=&pageSize=`
- `POST /sales`
- `GET /sales/{id}`
- `POST /sales/{id}/payments`
- `GET /sales/{id}/invoice`
- `GET /sales/{id}/ledger`

## Payments

- `GET /payments?customerId=&supplierId=&method=&from=&to=`
- `POST /payments/customer`
- `POST /payments/supplier`
- `GET /payments/{id}/receipt`
- `GET /payments/due`

## Reports

- `GET /reports/daily?date=`
- `GET /reports/monthly?month=`
- `GET /reports/yearly?year=`
- `GET /reports/customer-statement?customerId=&from=&to=&format=pdf|xlsx`
- `GET /reports/supplier-statement?supplierId=&from=&to=&format=pdf|xlsx`
- `GET /reports/sales?from=&to=&format=pdf|xlsx`
- `GET /reports/inventory?format=pdf|xlsx`
- `GET /reports/profit-loss?from=&to=&format=pdf|xlsx`

## Notifications

- `GET /notifications`
- `PATCH /notifications/{id}/read`
- `PATCH /notifications/read-all`

## Standard Error Response

```json
{
  "traceId": "00-...",
  "code": "validation_error",
  "message": "The request is invalid.",
  "errors": {
    "field": ["Message"]
  }
}
```
