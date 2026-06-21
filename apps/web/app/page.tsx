import {
  Bell,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Gauge,
  PackageCheck,
  Search,
  Settings,
  Users
} from "lucide-react";

const metrics = [
  { label: "Receivable", value: "PKR 1.82M", tone: "text-danger", icon: CircleDollarSign },
  { label: "Payable", value: "PKR 640K", tone: "text-warning", icon: CreditCard },
  { label: "Inventory Value", value: "PKR 3.34M", tone: "text-brand", icon: Boxes },
  { label: "Ready Pumps", value: "18", tone: "text-success", icon: PackageCheck }
];

const modules = [
  { label: "Customers", count: "486", icon: Users },
  { label: "Suppliers", count: "72", icon: ClipboardList },
  { label: "Inventory", count: "1,248 parts", icon: Boxes },
  { label: "Production", count: "31 active", icon: Gauge }
];

const payments = [
  { customer: "Ali Traders", amount: "PKR 25,000", due: "Today" },
  { customer: "Mian Pumps", amount: "PKR 18,500", due: "Tomorrow" },
  { customer: "Hassan Electric", amount: "PKR 44,000", due: "Jun 27" }
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen text-foam">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-line/70 bg-ink/88 px-4 py-5 shadow-2xl shadow-brand/10 backdrop-blur lg:block">
          <div className="mb-7 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-brand text-sm font-bold text-ink shadow-lg shadow-brand/30">PE</div>
            <div>
              <p className="text-sm font-semibold text-foam">PumpERP</p>
              <p className="text-xs text-aqua/70">Cloud Khata</p>
            </div>
          </div>
          <nav className="space-y-1">
            {["Dashboard", "Customers", "Suppliers", "Inventory", "Pumps", "Sales", "Payments", "Reports"].map(
              (item) => (
                <button
                  key={item}
                  className="flex h-10 w-full items-center rounded-md px-3 text-left text-sm font-medium text-foam/70 hover:bg-brand/15 hover:text-aqua"
                >
                  {item}
                </button>
              )
            )}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-16 items-center justify-between border-b border-line/70 bg-night/80 px-4 backdrop-blur sm:px-6">
            <div>
              <h1 className="text-xl font-semibold tracking-normal">Dashboard</h1>
              <p className="text-sm text-aqua/70">Live business position and daily operations</p>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Search" className="grid size-10 place-items-center rounded-md border border-line bg-panel/80 text-aqua">
                <Search className="size-4" />
              </button>
              <button aria-label="Notifications" className="grid size-10 place-items-center rounded-md border border-line bg-panel/80 text-aqua">
                <Bell className="size-4" />
              </button>
              <button aria-label="Settings" className="grid size-10 place-items-center rounded-md border border-line bg-panel/80 text-aqua">
                <Settings className="size-4" />
              </button>
            </div>
          </header>

          <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <article key={metric.label} className="rounded-lg border border-line/80 bg-panel/82 p-4 shadow-xl shadow-ink/30 backdrop-blur">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-aqua/68">{metric.label}</span>
                      <metric.icon className={`size-5 ${metric.tone}`} />
                    </div>
                    <strong className="block text-2xl font-semibold tracking-normal">{metric.value}</strong>
                  </article>
                ))}
              </section>

              <section className="rounded-lg border border-line/80 bg-panel/82 shadow-xl shadow-ink/30 backdrop-blur">
                <div className="flex items-center justify-between border-b border-line/80 px-4 py-3">
                  <h2 className="text-base font-semibold">Smart Customer Search</h2>
                  <span className="text-xs font-medium text-success">Synced</span>
                </div>
                <div className="p-4">
                  <label className="relative block">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-aqua/60" />
                    <input
                      className="h-11 w-full rounded-md border border-line bg-ink/65 pl-10 pr-3 text-foam outline-none placeholder:text-foam/40 focus:border-brand"
                      placeholder="Search by name, mobile, WhatsApp, or CNIC"
                    />
                  </label>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-md border border-line/80 bg-ink/35 p-3">
                      <p className="text-xs text-aqua/68">Outstanding</p>
                      <p className="mt-1 text-lg font-semibold">PKR 86,000</p>
                    </div>
                    <div className="rounded-md border border-line/80 bg-ink/35 p-3">
                      <p className="text-xs text-aqua/68">Last Payment</p>
                      <p className="mt-1 text-lg font-semibold">PKR 14,000</p>
                    </div>
                    <div className="rounded-md border border-line/80 bg-ink/35 p-3">
                      <p className="text-xs text-aqua/68">Pumps Purchased</p>
                      <p className="mt-1 text-lg font-semibold">7</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {modules.map((module) => (
                  <article key={module.label} className="rounded-lg border border-line/80 bg-panel/82 p-4 shadow-xl shadow-ink/30 backdrop-blur">
                    <module.icon className="mb-5 size-5 text-brand" />
                    <p className="text-sm text-aqua/68">{module.label}</p>
                    <p className="mt-1 text-xl font-semibold">{module.count}</p>
                  </article>
                ))}
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-lg border border-line/80 bg-panel/82 shadow-xl shadow-ink/30 backdrop-blur">
                <div className="border-b border-line/80 px-4 py-3">
                  <h2 className="text-base font-semibold">Due Payments</h2>
                </div>
                <div className="divide-y divide-line/80">
                  {payments.map((payment) => (
                    <div key={payment.customer} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{payment.customer}</p>
                        <p className="text-xs text-aqua/68">{payment.due}</p>
                      </div>
                      <p className="text-sm font-semibold">{payment.amount}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-line/80 bg-panel/82 p-4 shadow-xl shadow-ink/30 backdrop-blur">
                <h2 className="text-base font-semibold">Pump Status</h2>
                <div className="mt-4 space-y-3">
                  {[
                    ["Pending", "9", "bg-warning"],
                    ["Under Work", "22", "bg-brand"],
                    ["Ready", "18", "bg-success"],
                    ["Delivered", "144", "bg-ink"]
                  ].map(([label, value, color]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{label}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-ink">
                        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Number(value) * 3}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
