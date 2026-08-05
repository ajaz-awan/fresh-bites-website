"use client";

import { useState, type ReactElement, type ReactNode, type FormEvent } from "react";
import { siteConfig } from "@/lib/siteConfig";
import type { Order } from "@/types";

interface Summary {
  revenue: number;
  cost: number;
  profit: number;
  orderCount: number;
}

function isSameDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isSameMonth(dateA: Date, dateB: Date): boolean {
  return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth();
}

function summarize(orders: Order[]): Summary {
  return orders.reduce(
    (acc, order) => ({
      revenue: acc.revenue + order.total_revenue,
      cost: acc.cost + order.total_cost,
      profit: acc.profit + order.total_profit,
      orderCount: acc.orderCount + 1,
    }),
    { revenue: 0, cost: 0, profit: 0, orderCount: 0 }
  );
}

export default function AdminPage(): ReactElement {
  const [password, setPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setErrorMessage("Incorrect password.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setOrders(data.orders as Order[]);
      setIsAuthenticated(true);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{
          background: "linear-gradient(160deg, rgba(232,169,58,0.25) 0%, rgba(250,246,238,1) 55%)",
        }}
      >
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-[2rem] p-8 shadow-xl"
          style={{ backgroundColor: "var(--color-base)" }}
        >
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)", fontFamily: "var(--font-fraunces)" }}
          >
            {siteConfig.brand.logoInitial}
          </div>

          <h1
            className="text-center text-2xl font-medium"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
          >
            Admin Login
          </h1>
          <p className="mt-1 text-center text-sm text-black/50">Sales &amp; profit dashboard</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-6 w-full rounded-xl border px-4 py-3 text-sm outline-none"
            style={{ borderColor: "rgba(43,35,32,0.15)" }}
          />

          {errorMessage && (
            <p className="mt-2 text-xs" style={{ color: "#b91c1c" }}>
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full rounded-full py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isLoading ? "Checking..." : "Log In"}
          </button>
        </form>
      </div>
    );
  }

  const now = new Date();
  const todayOrders: Order[] = orders.filter((order) => isSameDay(new Date(order.created_at), now));
  const monthOrders: Order[] = orders.filter((order) => isSameMonth(new Date(order.created_at), now));

  const todaySummary: Summary = summarize(todayOrders);
  const monthSummary: Summary = summarize(monthOrders);
  const allTimeSummary: Summary = summarize(orders);

  return (
    <div
      className="min-h-screen px-3 py-3 md:px-6 md:py-6"
      style={{
        background: "linear-gradient(160deg, rgba(232,169,58,0.25) 0%, rgba(250,246,238,1) 55%)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header bar */}
        <div
          className="flex items-center justify-between rounded-[2rem] px-8 py-6"
          style={{ backgroundColor: "var(--color-base)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--color-primary)", fontFamily: "var(--font-fraunces)" }}
            >
              {siteConfig.brand.logoInitial}
            </span>
            <div>
              <h1
                className="text-xl font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
              >
                Sales Dashboard
              </h1>
              <p className="text-xs text-black/40">{siteConfig.brand.name}</p>
            </div>
          </div>
          <span
            className="rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: "rgba(76,122,94,0.12)", color: "var(--color-fresh)" }}
          >
            Live
          </span>
        </div>

        {/* Summary cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard title="Today" summary={todaySummary} icon={<SunIcon />} />
          <SummaryCard title="This Month" summary={monthSummary} icon={<CalendarIcon />} />
          <SummaryCard title="All Time" summary={allTimeSummary} icon={<TrophyIcon />} />
        </div>

        {/* Orders list */}
        <div className="mt-4 rounded-[2rem] p-6 md:p-8" style={{ backgroundColor: "var(--color-base)" }}>
          <div className="mb-5 flex items-center justify-between">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
            >
              All Orders
            </h2>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: "rgba(107,30,35,0.08)", color: "var(--color-primary)" }}
            >
              {orders.length} total
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(107,30,35,0.06)" }}
              >
                <InboxIcon />
              </div>
              <p className="text-sm text-black/50">No orders yet — they'll show up here once customers checkout.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "rgba(43,35,32,0.08)" }}>
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr style={{ backgroundColor: "rgba(107,30,35,0.04)" }}>
                    <Th>Date</Th>
                    <Th>Customer</Th>
                    <Th>Area</Th>
                    <Th>Revenue</Th>
                    <Th>Cost</Th>
                    <Th>Profit</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "transparent" : "rgba(107,30,35,0.02)",
                        borderTop: "1px solid rgba(43,35,32,0.06)",
                      }}
                    >
                      <Td>
                        <span className="text-black/60">{new Date(order.created_at).toLocaleDateString()}</span>
                        <div className="text-xs text-black/35">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </Td>
                      <Td>
                        <span className="font-medium" style={{ color: "var(--color-text)" }}>
                          {order.customer_name}
                        </span>
                        <div className="text-xs text-black/40">{order.phone}</div>
                      </Td>
                      <Td>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{ backgroundColor: "rgba(232,169,58,0.15)", color: "var(--color-primary)" }}
                        >
                          {order.delivery_area}
                        </span>
                      </Td>
                      <Td>
                        <span className="font-semibold" style={{ color: "var(--color-text)" }}>
                          Rs. {order.total_revenue.toLocaleString()}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-black/50">Rs. {order.total_cost.toLocaleString()}</span>
                      </Td>
                      <Td>
                        <span
                          className="font-semibold"
                          style={{ color: order.total_profit >= 0 ? "var(--color-fresh)" : "#b91c1c" }}
                        >
                          Rs. {order.total_profit.toLocaleString()}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, summary, icon }: { title: string; summary: Summary; icon: ReactNode }): ReactElement {
  return (
    <div className="rounded-[2rem] p-6" style={{ backgroundColor: "var(--color-base)" }}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-black/40">{title}</h3>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(232,169,58,0.15)", color: "var(--color-primary)" }}
        >
          {icon}
        </div>
      </div>

      <p
        className="mt-4 text-3xl font-semibold"
        style={{ fontFamily: "var(--font-fraunces)", color: "var(--color-text)" }}
      >
        Rs. {summary.revenue.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-black/50">{summary.orderCount} orders</p>

      <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(43,35,32,0.08)" }}>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-black/35">Cost</p>
          <p className="text-sm font-medium text-black/60">Rs. {summary.cost.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-black/35">Profit</p>
          <p
            className="text-sm font-semibold"
            style={{ color: summary.profit >= 0 ? "var(--color-fresh)" : "#b91c1c" }}
          >
            Rs. {summary.profit.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: ReactNode }): ReactElement {
  return (
    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }): ReactElement {
  return <td className="px-4 py-3.5 align-top">{children}</td>;
}

function SunIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function CalendarIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function TrophyIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 5h3a2 2 0 0 1-2 4M7 5H4a2 2 0 0 0 2 4" />
    </svg>
  );
}

function InboxIcon(): ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
