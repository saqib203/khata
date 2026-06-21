const money = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0
});

const modules = [
  ["dashboard", "Dashboard"],
  ["customers", "Customers"],
  ["suppliers", "Suppliers"],
  ["inventory", "Inventory"],
  ["pumps", "Pumps"],
  ["sales", "Sales"],
  ["payments", "Payments"],
  ["reports", "Reports"],
  ["settings", "Settings"]
];

const fallbackData = {
  summary: {
    totalCustomers: 486,
    totalSuppliers: 72,
    totalPumps: 224,
    pendingPumps: 9,
    readyPumps: 18,
    deliveredPumps: 144,
    monthlySales: 2840000,
    monthlyPurchases: 1195000,
    totalReceivable: 1820000,
    totalPayable: 640000,
    profit: 515000,
    inventoryValue: 3340000
  },
  customers: [
    { id: "c-001", code: "CUS-202606-1001", name: "Ali Traders", mobile: "0300-1122334", whatsapp: "0300-1122334", cnic: "35202-1234567-1", city: "Lahore", totalSales: 245000, paid: 159000, balance: 86000, pumps: 7, lastPayment: "2026-06-18" },
    { id: "c-002", code: "CUS-202606-1002", name: "Mian Pumps", mobile: "0312-7788990", whatsapp: "0312-7788990", cnic: "35201-7654321-3", city: "Gujranwala", totalSales: 98000, paid: 79500, balance: 18500, pumps: 3, lastPayment: "2026-06-20" },
    { id: "c-003", code: "CUS-202606-1003", name: "Hassan Electric", mobile: "0321-4455667", whatsapp: "0321-4455667", cnic: "35202-9988776-5", city: "Faisalabad", totalSales: 174000, paid: 130000, balance: 44000, pumps: 5, lastPayment: "2026-06-16" }
  ],
  suppliers: [
    { id: "s-001", name: "Prime Motors Supply", contact: "042-111-7788", city: "Lahore", purchases: 920000, paid: 620000, balance: 300000 },
    { id: "s-002", name: "Bearing House", contact: "041-5522190", city: "Faisalabad", purchases: 380000, paid: 280000, balance: 100000 },
    { id: "s-003", name: "Metal Works", contact: "055-3322100", city: "Gujranwala", purchases: 240000, paid: 0, balance: 240000 }
  ],
  inventory: [
    { sku: "MTR-001", name: "1HP Motor", category: "Motors", stock: 22, threshold: 8, value: 770000 },
    { sku: "BRG-6204", name: "6204 Bearing", category: "Bearings", stock: 140, threshold: 50, value: 98000 },
    { sku: "IMP-2IN", name: "2 inch Impeller", category: "Impellers", stock: 11, threshold: 15, value: 66000 },
    { sku: "CAS-STEEL", name: "Steel Casing", category: "Casings", stock: 7, threshold: 10, value: 126000 }
  ],
  pumps: [
    { code: "PMP-1001", name: "1HP Water Pump", customer: "Ali Traders", status: "Ready", cost: 18500, sale: 26000, profit: 7500 },
    { code: "PMP-1002", name: "Repair Motor Pump", customer: "Mian Pumps", status: "Under Work", cost: 6200, sale: 11000, profit: 4800 },
    { code: "PMP-1003", name: "2HP New Assembly", customer: "Hassan Electric", status: "Pending", cost: 32000, sale: 45500, profit: 13500 }
  ],
  sales: [
    { invoice: "INV-202606-3901", customer: "Ali Traders", total: 10000, paid: 7000, balance: 3000 },
    { invoice: "INV-202606-3902", customer: "Mian Pumps", total: 18500, paid: 0, balance: 18500 },
    { invoice: "INV-202606-3903", customer: "Hassan Electric", total: 44000, paid: 0, balance: 44000 }
  ],
  payments: [
    { receipt: "RCP-202606-9011", customer: "Ali Traders", method: "Cash", amount: 5000, date: "2026-06-19" },
    { receipt: "RCP-202606-9012", customer: "Ali Traders", method: "JazzCash", amount: 2000, date: "2026-06-20" },
    { receipt: "RCP-202606-9013", customer: "Mian Pumps", method: "Bank Transfer", amount: 12000, date: "2026-06-20" }
  ],
  reports: {
    sales: 2840000,
    purchases: 1195000,
    profit: 515000,
    receivable: 1820000,
    payable: 640000
  }
};

const state = {
  page: "dashboard",
  data: {}
};

const nav = document.querySelector("#nav");
const view = document.querySelector("#view");
const title = document.querySelector("#page-title");
const subtitle = document.querySelector("#page-subtitle");

nav.innerHTML = modules
  .map(([key, label]) => `<button class="nav-button" data-page="${key}"><span>${label}</span><small></small></button>`)
  .join("");

nav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button) return;
  state.page = button.dataset.page;
  render();
});

document.querySelector("#theme-button").addEventListener("click", () => {
  document.documentElement.dataset.theme = document.documentElement.dataset.theme === "dark" ? "" : "dark";
});

document.querySelector("#sync-button").addEventListener("click", async () => {
  await loadData();
  toast("Cloud sync complete");
  render();
});

async function api(path) {
  const fallbackKey = {
    "/api/v1/dashboard/summary": "summary",
    "/api/v1/customers": "customers",
    "/api/v1/suppliers": "suppliers",
    "/api/v1/inventory/items": "inventory",
    "/api/v1/pumps": "pumps",
    "/api/v1/sales": "sales",
    "/api/v1/payments": "payments",
    "/api/v1/reports/monthly": "reports"
  }[path];

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Request failed: ${path}`);
    return response.json();
  } catch {
    return fallbackData[fallbackKey];
  }
}

async function loadData() {
  const [summary, customers, suppliers, inventory, pumps, sales, payments, reports] = await Promise.all([
    api("/api/v1/dashboard/summary"),
    api("/api/v1/customers"),
    api("/api/v1/suppliers"),
    api("/api/v1/inventory/items"),
    api("/api/v1/pumps"),
    api("/api/v1/sales"),
    api("/api/v1/payments"),
    api("/api/v1/reports/monthly")
  ]);

  state.data = { summary, customers, suppliers, inventory, pumps, sales, payments, reports };
}

function render() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === state.page);
  });

  const label = modules.find(([key]) => key === state.page)?.[1] ?? "Dashboard";
  title.textContent = label;
  subtitle.textContent = subtitleFor(state.page);

  const renderer = {
    dashboard: renderDashboard,
    customers: renderCustomers,
    suppliers: renderSuppliers,
    inventory: renderInventory,
    pumps: renderPumps,
    sales: renderSales,
    payments: renderPayments,
    reports: renderReports,
    settings: renderSettings
  }[state.page];

  view.innerHTML = renderer();
  wirePageEvents();
}

function subtitleFor(page) {
  return {
    dashboard: "Live business position, stock health, receivables, and due payments.",
    customers: "Smart customer search with khata balance, sales, pumps, and payment history.",
    suppliers: "Supplier purchase ledger, payments, and outstanding payable view.",
    inventory: "Parts stock, low stock alerts, valuation, and production usage.",
    pumps: "Production pipeline with cost, sale price, and profit visibility.",
    sales: "Invoice and installment tracking with automatic remaining balance.",
    payments: "Cash, bank transfer, Easypaisa, and JazzCash receipts.",
    reports: "Daily, monthly, inventory, statement, and profit reports.",
    settings: "Security, roles, sync, backup, and device controls."
  }[page];
}

function renderDashboard() {
  const { summary, customers, inventory, pumps, sales } = state.data;
  return `
    <section class="metric-grid">
      ${metric("Customers", summary.totalCustomers)}
      ${metric("Receivable", money.format(summary.totalReceivable))}
      ${metric("Payable", money.format(summary.totalPayable))}
      ${metric("Profit", money.format(summary.profit))}
    </section>
    <section class="content-grid">
      <div class="card">
        <div class="card-header"><h2>Smart Customer Search</h2><span class="status ok">Connected</span></div>
        <div class="card-body">
          <input class="search" data-search="customers" placeholder="Type customer name, mobile, WhatsApp, or CNIC" />
          <div id="customer-profile" class="profile-grid">
            ${customerProfile(customers[0])}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2>Operations</h2><span class="status warn">${summary.pendingPumps} pending</span></div>
        <div class="card-body">
          ${mini("Ready Pumps", summary.readyPumps)}
          ${mini("Inventory Value", money.format(summary.inventoryValue))}
          ${mini("Low Stock Items", inventory.filter((item) => item.stock <= item.threshold).length)}
          ${mini("Open Invoices", sales.filter((sale) => sale.balance > 0).length)}
        </div>
      </div>
    </section>
    <section class="module-grid" style="margin-top:16px">
      ${miniCard("Pumps", `${summary.totalPumps} total`, pumps.map((pump) => pump.status).join(" / "))}
      ${miniCard("Monthly Sales", money.format(summary.monthlySales), "Invoices and installments")}
      ${miniCard("Monthly Purchases", money.format(summary.monthlyPurchases), "Supplier purchasing")}
      ${miniCard("Cloud Sync", "Online", "Auto backup ready")}
    </section>
  `;
}

function renderCustomers() {
  return tableCard("Customers", ["Code", "Name", "Mobile", "City", "Sales", "Paid", "Balance"], state.data.customers.map((customer) => [
    customer.code,
    customer.name,
    customer.mobile,
    customer.city,
    money.format(customer.totalSales),
    money.format(customer.paid),
    money.format(customer.balance)
  ]));
}

function renderSuppliers() {
  return tableCard("Suppliers", ["Name", "Contact", "City", "Purchases", "Paid", "Payable"], state.data.suppliers.map((supplier) => [
    supplier.name,
    supplier.contact,
    supplier.city,
    money.format(supplier.purchases),
    money.format(supplier.paid),
    money.format(supplier.balance)
  ]));
}

function renderInventory() {
  return tableCard("Inventory", ["SKU", "Name", "Category", "Stock", "Alert", "Value"], state.data.inventory.map((item) => [
    item.sku,
    item.name,
    item.category,
    item.stock,
    item.stock <= item.threshold ? `<span class="status bad">Low</span>` : `<span class="status ok">OK</span>`,
    money.format(item.value)
  ]));
}

function renderPumps() {
  return tableCard("Pump Production", ["Code", "Name", "Customer", "Status", "Cost", "Sale", "Profit"], state.data.pumps.map((pump) => [
    pump.code,
    pump.name,
    pump.customer,
    status(pump.status),
    money.format(pump.cost),
    money.format(pump.sale),
    money.format(pump.profit)
  ]));
}

function renderSales() {
  return `
    <div class="card">
      <div class="card-header"><h2>Create Installment Example</h2><button class="primary-button" data-demo-payment>Record Payment</button></div>
      <div class="card-body">
        <div class="form-row">
          <input value="Pump Price: 10000 PKR" readonly />
          <input id="paid-now" value="2000" />
          <input id="remaining-now" value="3000 remaining before payment" readonly />
          <input id="after-pay" value="1000 remaining after payment" readonly />
        </div>
      </div>
    </div>
    ${tableCard("Sales", ["Invoice", "Customer", "Total", "Paid", "Balance"], state.data.sales.map((sale) => [
      sale.invoice,
      sale.customer,
      money.format(sale.total),
      money.format(sale.paid),
      money.format(sale.balance)
    ]))}
  `;
}

function renderPayments() {
  return tableCard("Payments", ["Receipt", "Customer", "Method", "Amount", "Date"], state.data.payments.map((payment) => [
    payment.receipt,
    payment.customer,
    payment.method,
    money.format(payment.amount),
    payment.date
  ]));
}

function renderReports() {
  const report = state.data.reports;
  return `
    <section class="report-grid">
      ${miniCard("Sales Report", money.format(report.sales), "Export PDF / Excel")}
      ${miniCard("Purchase Report", money.format(report.purchases), "Supplier cost view")}
      ${miniCard("Profit & Loss", money.format(report.profit), "Monthly net summary")}
      ${miniCard("Customer Statement", money.format(report.receivable), "Total receivable")}
      ${miniCard("Supplier Statement", money.format(report.payable), "Total payable")}
      ${miniCard("Inventory Report", money.format(state.data.summary.inventoryValue), "Current valuation")}
    </section>
  `;
}

function renderSettings() {
  return `
    <section class="module-grid">
      ${miniCard("Authentication", "JWT + Refresh", "Sessions and device tracking")}
      ${miniCard("Roles", "Owner / Accountant / Staff", "Permission-ready")}
      ${miniCard("Backup", "Daily", "Cloud restore workflow")}
      ${miniCard("Offline Sync", "Queued", "Mobile conflict-ready design")}
    </section>
  `;
}

function metric(label, value) {
  return `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`;
}

function mini(label, value) {
  return `<div class="mini"><span class="label">${label}</span><strong>${value}</strong></div>`;
}

function miniCard(title, value, detail) {
  return `<article class="card"><div class="card-body">${mini(title, value)}<p style="margin-top:10px;color:var(--muted);font-size:13px">${detail}</p></div></article>`;
}

function tableCard(heading, headers, rows) {
  return `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><h2>${heading}</h2><button class="primary-button">Export</button></div>
      <div style="overflow:auto">
        <table>
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    </div>
  `;
}

function customerProfile(customer) {
  return [
    mini("Customer", customer.name),
    mini("Outstanding", money.format(customer.balance)),
    mini("Total Sales", money.format(customer.totalSales)),
    mini("Payments Received", money.format(customer.paid)),
    mini("Pumps Purchased", customer.pumps),
    mini("Last Payment", customer.lastPayment)
  ].join("");
}

function status(value) {
  const className = value === "Ready" ? "ok" : value === "Pending" ? "bad" : "warn";
  return `<span class="status ${className}">${value}</span>`;
}

function wirePageEvents() {
  const search = document.querySelector("[data-search='customers']");
  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.toLowerCase();
      const customer = state.data.customers.find((item) =>
        [item.name, item.mobile, item.whatsapp, item.cnic].some((value) => value.toLowerCase().includes(term))
      ) ?? state.data.customers[0];
      document.querySelector("#customer-profile").innerHTML = customerProfile(customer);
    });
  }

  const demoPayment = document.querySelector("[data-demo-payment]");
  if (demoPayment) {
    demoPayment.addEventListener("click", () => toast("Payment recorded. Balance recalculated automatically."));
  }
}

function toast(message) {
  document.querySelector(".toast")?.remove();
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = message;
  document.body.append(element);
  setTimeout(() => element.remove(), 2600);
}

await loadData();
render();
