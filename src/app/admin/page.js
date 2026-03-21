"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Car,
  Users,
  MessageSquare,
  AlertCircle,
  Clock,
  LogOut,
  Activity,
  RefreshCw,
  Filter,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const STATUS_COLORS = {
  confirmed: "#3b82f6",
  pending: "#eab308",
  assigned: "#8b5cf6",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  assigned: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function getStatusBadgeClass(status = "pending") {
  return STATUS_BADGE[status] || STATUS_BADGE.pending;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [trendRange, setTrendRange] = useState("weekly");
  const [chartType, setChartType] = useState("area");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentBookings(data.recentBookings);
        if (showRefresh) toast.success("Dashboard refreshed");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const loadingToast = toast.loading("Logging out...");
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success("Logged out successfully");
        window.location.href = "/admin-login";
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Server error during logout");
    }
    setLoggingOut(false);
  };

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return recentBookings;
    return recentBookings.filter((b) => b.status === statusFilter);
  }, [recentBookings, statusFilter]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-3 text-gray-400">
        <Activity size={32} className="animate-pulse" />
        <p className="text-sm">Loading dashboard...</p>
      </div>
    );
  }

  // ── Derived values from real API data only ─────────────────────────────
  const trendData =
    trendRange === "weekly"
      ? stats.weeklyTrend || []
      : stats.monthlyTrend || [];

  const statusPieData = [
    {
      name: "Pending",
      value: stats.pendingBookings,
      color: STATUS_COLORS.pending,
    },
    {
      name: "Confirmed",
      value: stats.confirmedBookings,
      color: STATUS_COLORS.confirmed,
    },
    {
      name: "Assigned",
      value: stats.assignedBookings,
      color: STATUS_COLORS.assigned,
    },
    {
      name: "Completed",
      value: stats.completedBookings,
      color: STATUS_COLORS.completed,
    },
    {
      name: "Cancelled",
      value: stats.cancelledBookings,
      color: STATUS_COLORS.cancelled,
    },
  ].filter((d) => d.value > 0);

  const driverApprovalRate =
    stats.totalDrivers > 0
      ? Math.round((stats.approvedDrivers / stats.totalDrivers) * 100)
      : 0;

  const assignmentRate =
    stats.totalBookings > 0
      ? Math.round(
          ((stats.totalBookings - stats.unassignedBookings) /
            stats.totalBookings) *
            100,
        )
      : 0;

  const completionRate =
    stats.totalBookings > 0
      ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
      : 0;

  const driversPerVehicle =
    stats.totalVehicles > 0
      ? (stats.totalDrivers / stats.totalVehicles).toFixed(1)
      : "—";

  // Stat cards — every value from API
  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
      ring: "ring-blue-100",
      sub: `${stats.pendingBookings} pending`,
    },
    {
      title: "Completed",
      value: stats.completedBookings,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
      ring: "ring-green-100",
      sub: `${completionRate}% completion rate`,
    },
    {
      title: "Unassigned",
      value: stats.unassignedBookings,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
      ring: "ring-red-100",
      sub: "Needs a driver",
    },
    {
      title: "Total Drivers",
      value: stats.totalDrivers,
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
      ring: "ring-emerald-100",
      sub: `${stats.approvedDrivers} approved`,
    },
    {
      title: "Pending Drivers",
      value: stats.pendingDrivers,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      ring: "ring-orange-100",
      sub: "Awaiting review",
    },
    {
      title: "Total Vehicles",
      value: stats.totalVehicles,
      icon: Car,
      color: "bg-violet-50 text-violet-600",
      ring: "ring-violet-100",
      sub: `${driversPerVehicle} drivers/vehicle`,
    },
    {
      title: "Approved Drivers",
      value: stats.approvedDrivers,
      icon: UserCheck,
      color: "bg-teal-50 text-teal-600",
      ring: "ring-teal-100",
      sub: `${driverApprovalRate}% approval rate`,
    },
    {
      title: "Contact Messages",
      value: stats.totalContacts,
      icon: MessageSquare,
      color: "bg-amber-50 text-amber-600",
      ring: "ring-amber-100",
      sub: "From website",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {statCards.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`bg-white rounded-2xl border p-4 hover:shadow-md transition-all duration-200 ring-1 ${item.ring}`}
            >
              <div className={`p-2 rounded-xl ${item.color} w-fit mb-3`}>
                <Icon size={15} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium leading-tight">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                {item.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── CHARTS ROW ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Booking Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {trendRange === "weekly" ? "Last 7 days" : "Last 4 weeks"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1 text-xs">
                {["weekly", "monthly"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendRange(r)}
                    className={`px-3 py-1 rounded-md capitalize transition-all ${
                      trendRange === r
                        ? "bg-white shadow text-gray-900 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {r === "weekly" ? "Week" : "Month"}
                  </button>
                ))}
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1 text-xs">
                {["area", "bar"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className={`px-3 py-1 rounded-md capitalize transition-all ${
                      chartType === t
                        ? "bg-white shadow text-gray-900 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {t === "area" ? "Area" : "Bar"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {trendData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
              No bookings in this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              {chartType === "area" ? (
                <AreaChart
                  data={trendData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#000"
                    strokeWidth={2}
                    fill="url(#grad)"
                    dot={{ fill: "#000", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: "#000" }}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={trendData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="bookings" fill="#000" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Pie */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Booking Status</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {stats.totalBookings} total bookings
            </p>
          </div>
          {statusPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="42%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [`${value} bookings`, name]}
                />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
              No booking data yet
            </div>
          )}
        </div>
      </div>

      {/* ── METRICS ROW ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Driver Approval */}
        <div className="bg-black text-white rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Driver Approval
          </p>
          <p className="text-3xl font-bold mt-2">{driverApprovalRate}%</p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.approvedDrivers} approved · {stats.pendingDrivers} pending ·{" "}
            {stats.totalDrivers} total
          </p>
          <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${driverApprovalRate}%` }}
            />
          </div>
        </div>

        {/* Assignment Rate */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Assignment Rate
          </p>
          <p className="text-3xl font-bold mt-2 text-gray-900">
            {assignmentRate}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalBookings - stats.unassignedBookings} assigned ·{" "}
            {stats.unassignedBookings} unassigned
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-700"
              style={{ width: `${assignmentRate}%` }}
            />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Completion Rate
          </p>
          <p className="text-3xl font-bold mt-2 text-gray-900">
            {completionRate}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.completedBookings} completed · {stats.cancelledBookings}{" "}
            cancelled
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── RECENT BOOKINGS TABLE ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Showing {filteredBookings.length} of {recentBookings.length}{" "}
              entries
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-gray-400" />
            {[
              "all",
              "pending",
              "confirmed",
              "assigned",
              "completed",
              "cancelled",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`
                  px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all
                  ${
                    statusFilter === s
                      ? s === "all"
                        ? "bg-black text-white"
                        : `${STATUS_BADGE[s]} ring-1 ring-current`
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="p-4 text-left">Booking ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Route</th>
                <th className="p-4 text-left hidden md:table-cell">Vehicle</th>
                <th className="p-4 text-left hidden sm:table-cell">Date</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-400 text-sm"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {booking.bookingId}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {booking.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.email}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {booking.pickup} → {booking.drop}
                    </td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">
                      {booking.vehicle}
                    </td>
                    <td className="p-4 text-gray-500 hidden sm:table-cell">
                      {new Date(booking.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(booking.status)}`}
                      >
                        {booking.status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
