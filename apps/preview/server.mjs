import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT ?? 4300);

const data = {
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
    {
      id: "c-001",
      code: "CUS-202606-1001",
      name: "Ali Traders",
      mobile: "0300-1122334",
      whatsapp: "0300-1122334",
      cnic: "35202-1234567-1",
      city: "Lahore",
      totalSales: 245000,
      paid: 159000,
      balance: 86000,
      pumps: 7,
      lastPayment: "2026-06-18"
    },
    {
      id: "c-002",
      code: "CUS-202606-1002",
      name: "Mian Pumps",
      mobile: "0312-7788990",
      whatsapp: "0312-7788990",
      cnic: "35201-7654321-3",
      city: "Gujranwala",
      totalSales: 98000,
      paid: 79500,
      balance: 18500,
      pumps: 3,
      lastPayment: "2026-06-20"
    },
    {
      id: "c-003",
      code: "CUS-202606-1003",
      name: "Hassan Electric",
      mobile: "0321-4455667",
      whatsapp: "0321-4455667",
      cnic: "35202-9988776-5",
      city: "Faisalabad",
      totalSales: 174000,
      paid: 130000,
      balance: 44000,
      pumps: 5,
      lastPayment: "2026-06-16"
    }
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
  ]
};

function json(response, body, status = 200) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function fileType(path) {
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  }[extname(path)] ?? "application/octet-stream";
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (url.pathname === "/api/v1/dashboard/summary") return json(response, data.summary);
  if (url.pathname === "/api/v1/customers") return json(response, data.customers);
  if (url.pathname === "/api/v1/suppliers") return json(response, data.suppliers);
  if (url.pathname === "/api/v1/inventory/items") return json(response, data.inventory);
  if (url.pathname === "/api/v1/pumps") return json(response, data.pumps);
  if (url.pathname === "/api/v1/sales") return json(response, data.sales);
  if (url.pathname === "/api/v1/payments") return json(response, data.payments);
  if (url.pathname === "/api/v1/reports/monthly") {
    return json(response, {
      sales: data.summary.monthlySales,
      purchases: data.summary.monthlyPurchases,
      profit: data.summary.profit,
      receivable: data.summary.totalReceivable,
      payable: data.summary.totalPayable
    });
  }

  const requested = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const normalized = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const path = join(root, normalized);

  try {
    const content = await readFile(path);
    response.writeHead(200, { "content-type": fileType(path) });
    response.end(content);
  } catch {
    const fallback = await readFile(join(root, "index.html"));
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(fallback);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`PumpERP preview running at http://127.0.0.1:${port}`);
});
