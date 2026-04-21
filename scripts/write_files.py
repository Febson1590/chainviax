"""Write all remaining refactored pages for VaultEx."""
import pathlib, os

BASE = pathlib.Path(r"C:\Users\samso\OneDrive\Documents\Code\projects\broker\vaultex")

# ─────────────────────────────────────────────────────────────────────────────
# 1.  admin/copy-traders/page.tsx
# ─────────────────────────────────────────────────────────────────────────────
COPY_TRADERS_ADMIN = """\
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Users, Plus, StopCircle, ChevronDown, UserPlus, Edit2 } from "lucide-react";
import {
  adminCreateCopyTrader, adminUpdateCopyTrader, adminAssignCopyTrade,
  adminStopCopyTrade, adminGetAllCopyTraders, adminGetAllCopyTrades, adminGetAllUsers,
} from "@/lib/actions/investment";

interface CopyTrader {
  id: string; name: string; avatarUrl: string | null; specialty: string | null;
  winRate: number; totalROI: number; followers: number; minCopyAmount: number;
  profitInterval: number; maxInterval: number; minProfit: number; maxProfit: number;
  isActive: boolean; userCopyTrades: { id: string }[];
}
interface CopyTrade {
  id: string; traderName: string; amount: number; totalEarned: number;
  status: string; startedAt: string; user: { name: string | null; email: string };
}
interface UserOption { id: string; name: string | null; email: string }

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
const STATUS_COLORS: Record<string, string> = {
  ACTIVE:  "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  PAUSED:  "bg-yellow-500/10 border-yellow-500/25 text-yellow-400",
  STOPPED: "bg-red-500/10 border-red-500/25 text-red-400",
};
const inputCls = "w-full bg-white/[0.06] border border-white/[0.15] rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-500/60";
const labelCls = "text-xs font-medium text-slate-400 uppercase tracking-wider";

function TraderModal({ trader, onClose, onSuccess }: {
  trader?: CopyTrader; onClose: () => void; onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: trader?.name ?? "", avatarUrl: trader?.avatarUrl ?? "",
    specialty: trader?.specialty ?? "",
    winRate: String(trader?.winRate ?? 85), totalROI: String(trader?.totalROI ?? 120),
    followers: String(trader?.followers ?? 1200), minCopyAmount: String(trader?.minCopyAmount ?? 100),
    profitInterval: String(trader?.profitInterval ?? 60), maxInterval: String(trader?.maxInterval ?? 60),
    minProfit: String(trader?.minProfit ?? 0.3), maxProfit: String(trader?.maxProfit ?? 1.2),
  });
  const [loading, setLoading] = useState(false);
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    const payload = {
      name: form.name.trim(), avatarUrl: form.avatarUrl || undefined,
      specialty: form.specialty || undefined,
      winRate: parseFloat(form.winRate), totalROI: parseFloat(form.totalROI),
      followers: parseInt(form.followers), minCopyAmount: parseFloat(form.minCopyAmount),
      profitInterval: parseInt(form.profitInterval), maxInterval: parseInt(form.maxInterval),
      minProfit: parseFloat(form.minProfit), maxProfit: parseFloat(form.maxProfit),
    };
    const r = trader
      ? await adminUpdateCopyTrader(trader.id, payload)
      : await adminCreateCopyTrader(payload);
    setLoading(false);
    if (r.error) { toast.error(r.error); return; }
    toast.success(trader ? "Trader updated!" : "Trader created!");
    onSuccess(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card border border-sky-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-5">{trader ? "Edit Trader" : "Create Copy Trader"}</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Trader Name</label>
            <input className={inputCls + " mt-1"} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Alex Rivers" />
          </div>
          <div>
            <label className={labelCls}>Photo URL (optional)</label>
            <input className={inputCls + " mt-1"} value={form.avatarUrl} onChange={e => set("avatarUrl", e.target.value)} placeholder="https://…/photo.jpg" />
            {form.avatarUrl && (
              <img src={form.avatarUrl} alt="" className="mt-2 w-9 h-9 rounded-full object-cover border border-white/10"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
          </div>
          <div>
            <label className={labelCls}>Specialty</label>
            <input className={inputCls + " mt-1"} value={form.specialty} onChange={e => set("specialty", e.target.value)} placeholder="e.g. BTC/ETH Scalping" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Win Rate (%)</label><input type="number" className={inputCls + " mt-1"} value={form.winRate} onChange={e => set("winRate", e.target.value)} /></div>
            <div><label className={labelCls}>Total ROI (%)</label><input type="number" className={inputCls + " mt-1"} value={form.totalROI} onChange={e => set("totalROI", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Followers</label><input type="number" className={inputCls + " mt-1"} value={form.followers} onChange={e => set("followers", e.target.value)} /></div>
            <div><label className={labelCls}>Min Copy (USD)</label><input type="number" className={inputCls + " mt-1"} value={form.minCopyAmount} onChange={e => set("minCopyAmount", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Min Profit (%)</label><input type="number" step="0.01" className={inputCls + " mt-1"} value={form.minProfit} onChange={e => set("minProfit", e.target.value)} /></div>
            <div><label className={labelCls}>Max Profit (%)</label><input type="number" step="0.01" className={inputCls + " mt-1"} value={form.maxProfit} onChange={e => set("maxProfit", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Min Interval (s)</label><input type="number" className={inputCls + " mt-1"} value={form.profitInterval} onChange={e => set("profitInterval", e.target.value)} /></div>
            <div><label className={labelCls}>Max Interval (s)</label><input type="number" className={inputCls + " mt-1"} value={form.maxInterval} onChange={e => set("maxInterval", e.target.value)} /></div>
          </div>
          <p className="text-[11px] text-slate-500">Profit fires at a random time between Min and Max interval.</p>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : null}{trader ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AssignTradeModal({ traders, users, onClose, onSuccess }: {
  traders: CopyTrader[]; users: UserOption[]; onClose: () => void; onSuccess: () => void;
}) {
  const [form, setForm] = useState({ userId: "", traderId: "", amount: "" });
  const [loading, setLoading] = useState(false);
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  async function submit() {
    if (!form.userId) { toast.error("Select a user"); return; }
    if (!form.traderId) { toast.error("Select a trader"); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { toast.error("Enter a valid amount"); return; }
    setLoading(true);
    const r = await adminAssignCopyTrade({ userId: form.userId, traderId: form.traderId, amount: parseFloat(form.amount) });
    setLoading(false);
    if (r.error) { toast.error(r.error); return; }
    toast.success("Copy trade assigned!"); onSuccess(); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card border border-sky-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-5">Assign Copy Trade</h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>User</label>
            <div className="relative mt-1">
              <select value={form.userId} onChange={e => set("userId", e.target.value)} className={inputCls + " appearance-none pr-8"}>
                <option value="" className="bg-[#0d1e3a]">Select user…</option>
                {users.map(u => <option key={u.id} value={u.id} className="bg-[#0d1e3a]">{u.name || "—"} ({u.email})</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Trader</label>
            <div className="relative mt-1">
              <select value={form.traderId} onChange={e => set("traderId", e.target.value)} className={inputCls + " appearance-none pr-8"}>
                <option value="" className="bg-[#0d1e3a]">Select trader…</option>
                {traders.filter(t => t.isActive).map(t => (
                  <option key={t.id} value={t.id} className="bg-[#0d1e3a]">{t.name} ({t.winRate}% win)</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Copy Amount (USD)</label>
            <input type="number" className={inputCls + " mt-1"} value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="e.g. 2000" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : null}Assign
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCopyTradersPage() {
  const [traders, setTraders] = useState<CopyTrader[]>([]);
  const [trades, setTrades] = useState<CopyTrade[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTrader, setEditTrader] = useState<CopyTrader | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [tab, setTab] = useState<"traders" | "assignments">("traders");

  async function load() {
    setLoading(true);
    const [trs, tds, usrs] = await Promise.all([
      adminGetAllCopyTraders(), adminGetAllCopyTrades(), adminGetAllUsers(),
    ]);
    setTraders(trs.map((t: any) => ({
      ...t, winRate: Number(t.winRate), totalROI: Number(t.totalROI),
      minCopyAmount: Number(t.minCopyAmount), minProfit: Number(t.minProfit),
      maxProfit: Number(t.maxProfit), maxInterval: t.maxInterval ?? t.profitInterval,
    })));
    setTrades(tds.map((t: any) => ({
      ...t, amount: Number(t.amount), totalEarned: Number(t.totalEarned),
      startedAt: new Date(t.startedAt).toISOString(),
    })));
    setUsers(usrs);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleStop(tradeId: string) {
    if (!confirm("Stop this copy trade?")) return;
    setProcessing(tradeId);
    const r = await adminStopCopyTrade(tradeId);
    if (r.error) toast.error(r.error);
    else { toast.success("Stopped"); load(); }
    setProcessing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={20} className="text-sky-400" /> Copy Traders
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage traders and user copy assignments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAssign(true)} variant="outline"
            className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10 text-sm h-9 px-4">
            <UserPlus size={14} className="mr-1.5" /> Assign Trade
          </Button>
          <Button onClick={() => setShowCreate(true)}
            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm h-9 px-4">
            <Plus size={14} className="mr-1.5" /> New Trader
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Traders",        value: traders.length,                                      color: "text-white" },
          { label: "Active Traders", value: traders.filter(t => t.isActive).length,              color: "text-emerald-400" },
          { label: "Active Copies",  value: trades.filter(t => t.status === "ACTIVE").length,   color: "text-sky-400" },
          { label: "Total Earned",   value: fmt(trades.reduce((s, t) => s + t.totalEarned, 0)), color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 border-b border-white/5">
        {(["traders", "assignments"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${tab === t ? "text-sky-400 border-b-2 border-sky-400" : "text-slate-500 hover:text-white"}`}>
            {t === "traders" ? `Traders (${traders.length})` : `Assignments (${trades.length})`}
          </button>
        ))}
      </div>

      {tab === "traders" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <span className="text-sm font-semibold text-white">{traders.length} Trader{traders.length !== 1 ? "s" : ""}</span>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : traders.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No traders yet. Create one to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full premium-table">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Trader","Specialty","Win Rate","ROI","Followers","Profit Range","Interval","Copies","Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {traders.map(tr => {
                    const hue = [...tr.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
                    const initials = tr.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <tr key={tr.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {tr.avatarUrl ? (
                              <img src={tr.avatarUrl} alt={tr.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-white/10"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ background: `hsl(${hue} 60% 25%)`, border: `1px solid hsl(${hue} 60% 35%)` }}>
                                {initials}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-white">{tr.name}</div>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${tr.isActive ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-slate-500/10 border-slate-500/25 text-slate-400"}`}>
                                {tr.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{tr.specialty || "—"}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-emerald-400">{tr.winRate}%</td>
                        <td className="px-4 py-3 text-sm font-semibold text-sky-400">+{tr.totalROI}%</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{tr.followers.toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{tr.minProfit}%–{tr.maxProfit}%</td>
                        <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{tr.profitInterval}s–{tr.maxInterval}s</td>
                        <td className="px-4 py-3 text-xs text-white font-semibold">{tr.userCopyTrades.length}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" onClick={() => setEditTrader(tr)}
                            className="h-7 px-2 text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20">
                            <Edit2 size={11} className="mr-1" />Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "assignments" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <span className="text-sm font-semibold text-white">{trades.length} Assignment{trades.length !== 1 ? "s" : ""}</span>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : trades.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No assignments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full premium-table">
                <thead>
                  <tr className="border-b border-white/5">
                    {["User","Trader","Amount","Earned","Status","Started","Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trades.map(trade => (
                    <tr key={trade.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="text-sm text-white font-medium">{trade.user.name || "—"}</div>
                        <div className="text-xs text-slate-500">{trade.user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300 font-medium">{trade.traderName}</td>
                      <td className="px-4 py-3 text-sm font-bold text-white">{fmt(trade.amount)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-400">{fmt(trade.totalEarned)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[trade.status] || ""}`}>{trade.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{new Date(trade.startedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {trade.status === "ACTIVE" && (
                          <Button size="sm" disabled={processing === trade.id} onClick={() => handleStop(trade.id)}
                            className="h-7 px-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20">
                            {processing === trade.id ? <Loader2 size={11} className="animate-spin" /> : <><StopCircle size={11} className="mr-1" />Stop</>}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showCreate && <TraderModal onClose={() => setShowCreate(false)} onSuccess={load} />}
      {editTrader && <TraderModal trader={editTrader} onClose={() => setEditTrader(null)} onSuccess={load} />}
      {showAssign && <AssignTradeModal traders={traders} users={users} onClose={() => setShowAssign(false)} onSuccess={load} />}
    </div>
  );
}
"""

# ─────────────────────────────────────────────────────────────────────────────
# 2.  admin/investments/page.tsx  — Plans tab + Users tab
# ─────────────────────────────────────────────────────────────────────────────
INVESTMENTS_ADMIN = """\
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2, TrendingUp, Plus, PauseCircle, PlayCircle,
  XCircle, ChevronDown, Pencil, DollarSign, ToggleLeft, ToggleRight,
} from "lucide-react";
import {
  adminAssignInvestment, adminEditInvestment, adminAddFundsToInvestment,
  adminToggleInvestment, adminCancelInvestment, adminGetAllInvestments,
  adminGetAllUsers, adminGetInvestmentPlans, adminCreatePlan, adminUpdatePlan,
} from "@/lib/actions/investment";

interface UserInvestment {
  id: string; userId: string; planName: string; amount: number; totalEarned: number;
  minProfit: number; maxProfit: number; profitInterval: number; maxInterval: number;
  status: string; startedAt: string; user: { name: string | null; email: string };
}
interface Plan {
  id: string; name: string; description: string | null; minAmount: number;
  minProfit: number; maxProfit: number; profitInterval: number; maxInterval: number;
  isActive: boolean; _count: { userInvestments: number };
}
interface UserOption { id: string; name: string | null; email: string }

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  PAUSED:    "bg-yellow-500/10 border-yellow-500/25 text-yellow-400",
  COMPLETED: "bg-sky-500/10 border-sky-500/25 text-sky-400",
  CANCELLED: "bg-red-500/10 border-red-500/25 text-red-400",
};
const inputCls = "w-full bg-white/[0.06] border border-white/[0.15] rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-500/60";
const labelCls = "text-xs font-medium text-slate-400 uppercase tracking-wider";

// ── Plan Modal ────────────────────────────────────────────────────────────────
function PlanModal({ plan, onClose, onSuccess }: { plan?: Plan; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: plan?.name ?? "", description: plan?.description ?? "",
    minAmount: String(plan?.minAmount ?? 100),
    minProfit: String(plan?.minProfit ?? 0.5), maxProfit: String(plan?.maxProfit ?? 1.5),
    profitInterval: String(plan?.profitInterval ?? 60), maxInterval: String(plan?.maxInterval ?? 60),
  });
  const [loading, setLoading] = useState(false);
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    setLoading(true);
    const payload = {
      name: form.name.trim(), description: form.description || undefined,
      minAmount: parseFloat(form.minAmount),
      minProfit: parseFloat(form.minProfit), maxProfit: parseFloat(form.maxProfit),
      profitInterval: parseInt(form.profitInterval), maxInterval: parseInt(form.maxInterval),
    };
    const r = plan ? await adminUpdatePlan(plan.id, payload) : await adminCreatePlan(payload);
    setLoading(false);
    if (r.error) { toast.error(r.error); return; }
    toast.success(plan ? "Plan updated!" : "Plan created!");
    onSuccess(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card border border-sky-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-5">{plan ? "Edit Plan" : "Create Investment Plan"}</h3>
        <div className="space-y-4">
          <div><label className={labelCls}>Plan Name</label><input className={inputCls + " mt-1"} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Growth Plan" /></div>
          <div><label className={labelCls}>Description (optional)</label><input className={inputCls + " mt-1"} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short description…" /></div>
          <div><label className={labelCls}>Min Amount (USD)</label><input type="number" className={inputCls + " mt-1"} value={form.minAmount} onChange={e => set("minAmount", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Min Profit (%)</label><input type="number" step="0.01" className={inputCls + " mt-1"} value={form.minProfit} onChange={e => set("minProfit", e.target.value)} /></div>
            <div><label className={labelCls}>Max Profit (%)</label><input type="number" step="0.01" className={inputCls + " mt-1"} value={form.maxProfit} onChange={e => set("maxProfit", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Min Interval (s)</label><input type="number" className={inputCls + " mt-1"} value={form.profitInterval} onChange={e => set("profitInterval", e.target.value)} /></div>
            <div><label className={labelCls}>Max Interval (s)</label><input type="number" className={inputCls + " mt-1"} value={form.maxInterval} onChange={e => set("maxInterval", e.target.value)} /></div>
          </div>
          <p className="text-[11px] text-slate-500">Profit fires at a random time between Min and Max interval.</p>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : null}{plan ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Investment Modal (assign / edit user investment) ──────────────────────────
function InvestmentModal({ users, investment, isEdit, onClose, onSuccess }: {
  users: UserOption[]; investment?: UserInvestment; isEdit: boolean;
  onClose: () => void; onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    userId: investment?.userId ?? "", planName: investment?.planName ?? "Growth Plan",
    amount: String(investment?.amount ?? ""),
    minProfit: String(investment?.minProfit ?? 0.5), maxProfit: String(investment?.maxProfit ?? 1.5),
    profitInterval: String(investment?.profitInterval ?? 60),
    maxInterval: String(investment?.maxInterval ?? 60),
  });
  const [loading, setLoading] = useState(false);
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    if (!isEdit && !form.userId) { toast.error("Select a user"); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { toast.error("Enter a valid amount"); return; }
    setLoading(true);
    if (isEdit && investment) {
      const r = await adminEditInvestment(investment.userId, {
        planName: form.planName, amount: parseFloat(form.amount),
        minProfit: parseFloat(form.minProfit), maxProfit: parseFloat(form.maxProfit),
        profitInterval: parseInt(form.profitInterval), maxInterval: parseInt(form.maxInterval),
      });
      setLoading(false);
      if (r.error) { toast.error(r.error); return; }
      toast.success("Investment updated!");
    } else {
      const r = await adminAssignInvestment({
        userId: form.userId, planName: form.planName, amount: parseFloat(form.amount),
        minProfit: parseFloat(form.minProfit), maxProfit: parseFloat(form.maxProfit),
        profitInterval: parseInt(form.profitInterval), maxInterval: parseInt(form.maxInterval),
      });
      setLoading(false);
      if (r.error) { toast.error(r.error); return; }
      toast.success("Investment assigned!");
    }
    onSuccess(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card border border-sky-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-5">{isEdit ? "Edit Investment" : "Assign Investment"}</h3>
        <div className="space-y-4">
          {!isEdit && (
            <div><label className={labelCls}>User</label>
              <div className="relative mt-1">
                <select value={form.userId} onChange={e => set("userId", e.target.value)} className={inputCls + " appearance-none pr-8"}>
                  <option value="" className="bg-[#0d1e3a]">Select user…</option>
                  {users.map(u => <option key={u.id} value={u.id} className="bg-[#0d1e3a]">{u.name || "—"} ({u.email})</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}
          {isEdit && investment && (
            <div><label className={labelCls}>User</label>
              <div className="mt-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm">
                <span className="text-white font-medium">{investment.user.name || "—"}</span>
                <span className="text-slate-500 ml-2">{investment.user.email}</span>
              </div>
            </div>
          )}
          <div><label className={labelCls}>Plan Name</label><input className={inputCls + " mt-1"} value={form.planName} onChange={e => set("planName", e.target.value)} /></div>
          <div><label className={labelCls}>Amount (USD)</label><input type="number" className={inputCls + " mt-1"} value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Min Profit (%)</label><input type="number" step="0.01" className={inputCls + " mt-1"} value={form.minProfit} onChange={e => set("minProfit", e.target.value)} /></div>
            <div><label className={labelCls}>Max Profit (%)</label><input type="number" step="0.01" className={inputCls + " mt-1"} value={form.maxProfit} onChange={e => set("maxProfit", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Min Interval (s)</label><input type="number" className={inputCls + " mt-1"} value={form.profitInterval} onChange={e => set("profitInterval", e.target.value)} /></div>
            <div><label className={labelCls}>Max Interval (s)</label><input type="number" className={inputCls + " mt-1"} value={form.maxInterval} onChange={e => set("maxInterval", e.target.value)} /></div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : null}{isEdit ? "Save" : "Assign"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Add Funds Modal ───────────────────────────────────────────────────────────
function AddFundsModal({ investment, onClose, onSuccess }: { investment: UserInvestment; onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit() {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error("Enter a valid amount"); return; }
    setLoading(true);
    const r = await adminAddFundsToInvestment(investment.userId, val);
    setLoading(false);
    if (r.error) { toast.error(r.error); return; }
    toast.success(`${fmt(val)} added`); onSuccess(); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card border border-sky-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-1">Add Funds</h3>
        <p className="text-xs text-slate-500 mb-4">No wallet deduction — directly adds to investment balance.</p>
        <div className="mb-4 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10">
          <div className="text-sm text-white font-medium">{investment.user.name || "—"}</div>
          <div className="text-xs text-slate-500">{investment.user.email} · <span className="text-sky-400">{investment.planName}</span></div>
          <div className="text-xs text-slate-400 mt-0.5">Current: <span className="text-white font-semibold">{fmt(investment.amount)}</span></div>
        </div>
        <div className="mb-5"><label className={labelCls}>Amount (USD)</label>
          <input type="number" className={inputCls + " mt-1"} value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : <DollarSign size={14} className="mr-1" />}Add Funds
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminInvestmentsPage() {
  const [tab, setTab] = useState<"plans" | "users">("plans");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [editInv, setEditInv] = useState<UserInvestment | null>(null);
  const [fundsTarget, setFundsTarget] = useState<UserInvestment | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [plns, invs, usrs] = await Promise.all([
      adminGetInvestmentPlans(), adminGetAllInvestments(), adminGetAllUsers(),
    ]);
    setPlans(plns.map((p: any) => ({
      ...p, minAmount: Number(p.minAmount), minProfit: Number(p.minProfit),
      maxProfit: Number(p.maxProfit), maxInterval: p.maxInterval ?? p.profitInterval,
    })));
    setInvestments(invs.map((i: any) => ({
      ...i, amount: Number(i.amount), totalEarned: Number(i.totalEarned),
      minProfit: Number(i.minProfit), maxProfit: Number(i.maxProfit),
      maxInterval: i.maxInterval ?? i.profitInterval,
      startedAt: new Date(i.startedAt).toISOString(),
    })));
    setUsers(usrs);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function togglePlan(plan: Plan) {
    setProcessing(plan.id);
    const r = await adminUpdatePlan(plan.id, { isActive: !plan.isActive });
    if (r.error) toast.error(r.error);
    else { toast.success(plan.isActive ? "Plan deactivated" : "Plan activated"); load(); }
    setProcessing(null);
  }

  async function handleToggleInv(userId: string, current: string) {
    setProcessing(userId);
    const newStatus = current === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const r = await adminToggleInvestment(userId, newStatus as "ACTIVE" | "PAUSED");
    if (r.error) toast.error(r.error);
    else { toast.success(`Investment ${newStatus.toLowerCase()}`); load(); }
    setProcessing(null);
  }

  async function handleCancelInv(userId: string) {
    if (!confirm("Cancel this investment?")) return;
    setProcessing(userId);
    const r = await adminCancelInvestment(userId);
    if (r.error) toast.error(r.error);
    else { toast.success("Cancelled"); load(); }
    setProcessing(null);
  }

  const activeInv = investments.filter(i => i.status === "ACTIVE").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-sky-400" /> Investments
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage investment plans and user portfolios</p>
        </div>
        <div className="flex gap-2">
          {tab === "plans" && (
            <Button onClick={() => setShowCreatePlan(true)} className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm h-9 px-4">
              <Plus size={14} className="mr-1.5" /> New Plan
            </Button>
          )}
          {tab === "users" && (
            <Button onClick={() => setShowAssign(true)} className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm h-9 px-4">
              <Plus size={14} className="mr-1.5" /> Assign Investment
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Plans",         value: plans.length,                                                  color: "text-white" },
          { label: "Active Plans",  value: plans.filter(p => p.isActive).length,                          color: "text-emerald-400" },
          { label: "Active Invs",   value: activeInv,                                                     color: "text-sky-400" },
          { label: "Total Earned",  value: fmt(investments.reduce((s, i) => s + i.totalEarned, 0)),       color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 border-b border-white/5">
        {(["plans", "users"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors capitalize ${tab === t ? "text-sky-400 border-b-2 border-sky-400" : "text-slate-500 hover:text-white"}`}>
            {t === "plans" ? `Plans (${plans.length})` : `Users (${investments.length})`}
          </button>
        ))}
      </div>

      {/* Plans tab */}
      {tab === "plans" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <span className="text-sm font-semibold text-white">{plans.length} Plan{plans.length !== 1 ? "s" : ""}</span>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : plans.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No plans yet. Create one to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full premium-table">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Plan","Min Amount","Profit Range","Interval","Users","Status","Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-white">{plan.name}</div>
                        {plan.description && <div className="text-xs text-slate-500 mt-0.5 max-w-[180px] truncate">{plan.description}</div>}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-white">{fmt(plan.minAmount)}</td>
                      <td className="px-4 py-3 text-sm text-emerald-400 whitespace-nowrap">{plan.minProfit}%–{plan.maxProfit}%</td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{plan.profitInterval}s–{plan.maxInterval}s</td>
                      <td className="px-4 py-3 text-xs text-white font-semibold">{plan._count.userInvestments}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${plan.isActive ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-slate-500/10 border-slate-500/25 text-slate-400"}`}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" onClick={() => setEditPlan(plan)}
                            className="h-7 px-2 text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20">
                            <Pencil size={11} className="mr-1" />Edit
                          </Button>
                          <Button size="sm" disabled={processing === plan.id} onClick={() => togglePlan(plan)}
                            className={`h-7 px-2 text-xs border ${plan.isActive ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/20" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"}`}>
                            {processing === plan.id ? <Loader2 size={11} className="animate-spin" /> : plan.isActive ? <><ToggleLeft size={11} className="mr-1" />Disable</> : <><ToggleRight size={11} className="mr-1" />Enable</>}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users tab */}
      {tab === "users" && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <span className="text-sm font-semibold text-white">{investments.length} Investment{investments.length !== 1 ? "s" : ""}</span>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : investments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No investments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full premium-table">
                <thead>
                  <tr className="border-b border-white/5">
                    {["User","Plan","Amount","Earned","Rate","Interval","Status","Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {investments.map(inv => (
                    <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="text-sm text-white font-medium">{inv.user.name || "—"}</div>
                        <div className="text-xs text-slate-500">{inv.user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300 font-medium">{inv.planName}</td>
                      <td className="px-4 py-3 text-sm font-bold text-white">{fmt(inv.amount)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-400">{fmt(inv.totalEarned)}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{inv.minProfit}%–{inv.maxProfit}%</td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{inv.profitInterval}s–{inv.maxInterval}s</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[inv.status] || ""}`}>{inv.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {inv.status !== "CANCELLED" && (
                            <Button size="sm" onClick={() => setEditInv(inv)}
                              className="h-7 px-2 text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20">
                              <Pencil size={11} className="mr-1" />Edit
                            </Button>
                          )}
                          {(inv.status === "ACTIVE" || inv.status === "PAUSED") && (
                            <Button size="sm" onClick={() => setFundsTarget(inv)}
                              className="h-7 px-2 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                              <DollarSign size={11} className="mr-1" />Funds
                            </Button>
                          )}
                          {(inv.status === "ACTIVE" || inv.status === "PAUSED") && (
                            <Button size="sm" disabled={processing === inv.userId} onClick={() => handleToggleInv(inv.userId, inv.status)}
                              className={`h-7 px-2 text-xs border ${inv.status === "ACTIVE" ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/20" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"}`}>
                              {processing === inv.userId ? <Loader2 size={11} className="animate-spin" /> : inv.status === "ACTIVE" ? <><PauseCircle size={11} className="mr-1" />Pause</> : <><PlayCircle size={11} className="mr-1" />Resume</>}
                            </Button>
                          )}
                          {(inv.status === "ACTIVE" || inv.status === "PAUSED") && (
                            <Button size="sm" disabled={processing === inv.userId} onClick={() => handleCancelInv(inv.userId)}
                              className="h-7 px-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20">
                              <XCircle size={11} className="mr-1" />Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showCreatePlan && <PlanModal onClose={() => setShowCreatePlan(false)} onSuccess={load} />}
      {editPlan && <PlanModal plan={editPlan} onClose={() => setEditPlan(null)} onSuccess={load} />}
      {showAssign && <InvestmentModal users={users} isEdit={false} onClose={() => setShowAssign(false)} onSuccess={load} />}
      {editInv && <InvestmentModal users={users} investment={editInv} isEdit={true} onClose={() => setEditInv(null)} onSuccess={load} />}
      {fundsTarget && <AddFundsModal investment={fundsTarget} onClose={() => setFundsTarget(null)} onSuccess={load} />}
    </div>
  );
}
"""

# ─────────────────────────────────────────────────────────────────────────────
# 3.  dashboard/investments/investments-client.tsx
# ─────────────────────────────────────────────────────────────────────────────
INV_CLIENT = """\
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, CheckCircle, PauseCircle, XCircle, Clock,
  Plus, ArrowDownToLine, DollarSign, Loader2, ChevronRight,
} from "lucide-react";
import { userStartInvestment, addInvestmentFunds } from "@/lib/actions/investment";
import { formatCurrency } from "@/lib/utils";

interface Plan {
  id: string; name: string; description: string | null;
  minAmount: number; minProfit: number; maxProfit: number;
  profitInterval: number; maxInterval: number; isActive: boolean;
}
interface ActiveInvestment {
  planName: string; amount: number; totalEarned: number;
  minProfit: number; maxProfit: number; profitInterval: number;
  maxInterval: number; status: string;
}
interface Props { plans: Plan[]; investment: ActiveInvestment | null; usdBalance: number }

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string; Icon: typeof CheckCircle }> = {
  ACTIVE:    { label: "Active",    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", Icon: CheckCircle },
  PAUSED:    { label: "Paused",    color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/30",  Icon: PauseCircle },
  CANCELLED: { label: "Cancelled", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30",     Icon: XCircle },
};

function PlanCard({ plan, onSelect }: { plan: Plan; onSelect: (p: Plan) => void }) {
  return (
    <div onClick={() => onSelect(plan)}
      className="glass-card rounded-2xl border border-sky-500/15 hover:border-sky-500/40 transition-all cursor-pointer group overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">{plan.name}</h3>
            {plan.description && <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>}
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-sky-400 transition-colors mt-0.5 flex-shrink-0" />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/[0.04] rounded-xl p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Min Investment</div>
            <div className="text-sm font-bold text-white">{formatCurrency(plan.minAmount)}</div>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Profit / Cycle</div>
            <div className="text-sm font-bold text-emerald-400">{plan.minProfit}%–{plan.maxProfit}%</div>
          </div>
          <div className="bg-white/[0.04] rounded-xl p-3 col-span-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Random Cycle</div>
            <div className="text-sm font-bold text-sky-400">Every {plan.profitInterval}s–{plan.maxInterval}s</div>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-white/[0.05] bg-sky-500/[0.03] group-hover:bg-sky-500/[0.06] transition-colors">
        <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
          <DollarSign size={11} /> Invest in this plan
        </span>
      </div>
    </div>
  );
}

function InvestModal({ plan, usdBalance, onClose, onSuccess }: {
  plan: Plan; usdBalance: number; onClose: () => void; onSuccess: () => void;
}) {
  const [amount, setAmount] = useState(String(plan.minAmount));
  const [isPending, start] = useTransition();
  const val = parseFloat(amount) || 0;
  const canAfford = val <= usdBalance;
  const meetsMin = val >= plan.minAmount;

  function submit() {
    if (!meetsMin) { toast.error(`Minimum is ${formatCurrency(plan.minAmount)}`); return; }
    if (!canAfford) { toast.error("Insufficient USD balance"); return; }
    start(async () => {
      const r = await userStartInvestment({ planId: plan.id, amount: val });
      if (r.error) { toast.error(r.error); return; }
      toast.success("Investment activated!"); onSuccess();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card border border-sky-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-1">Invest in {plan.name}</h3>
        <p className="text-xs text-slate-500 mb-5">{plan.minProfit}%–{plan.maxProfit}% every {plan.profitInterval}s–{plan.maxInterval}s</p>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-center">
            <div className="text-[10px] text-slate-500 mb-0.5">Balance</div>
            <div className="text-sm font-bold text-white">{formatCurrency(usdBalance)}</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-center">
            <div className="text-[10px] text-slate-500 mb-0.5">Min Amount</div>
            <div className="text-sm font-bold text-sky-400">{formatCurrency(plan.minAmount)}</div>
          </div>
        </div>
        <div className="mb-5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Amount (USD)</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input type="number" autoFocus step="100"
              className="w-full bg-white/[0.06] border border-white/[0.15] rounded-lg pl-7 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/60"
              value={amount} onChange={e => setAmount(e.target.value)} min={plan.minAmount} />
          </div>
          {val > 0 && !canAfford && <p className="text-[11px] text-red-400 mt-1">Insufficient balance</p>}
          {val > 0 && !meetsMin && <p className="text-[11px] text-yellow-400 mt-1">Below minimum of {formatCurrency(plan.minAmount)}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold" onClick={submit} disabled={isPending || !canAfford || !meetsMin}>
            {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

function AddFundsModal({ investment, usdBalance, onClose, onSuccess }: {
  investment: ActiveInvestment; usdBalance: number; onClose: () => void; onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [isPending, start] = useTransition();

  function submit() {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error("Enter a valid amount"); return; }
    if (val > usdBalance) { toast.error("Insufficient USD balance"); return; }
    start(async () => {
      const r = await addInvestmentFunds(val);
      if (r.error) { toast.error(r.error); return; }
      toast.success("Funds added!"); onSuccess();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card border border-sky-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-bold text-white mb-1">Add Funds</h3>
        <p className="text-xs text-slate-500 mb-4">Adding to <span className="text-white font-medium">{investment.planName}</span></p>
        <div className="mb-4 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 flex justify-between">
          <span className="text-xs text-slate-500">Available Balance</span>
          <span className="text-sm font-bold text-white">{formatCurrency(usdBalance)}</span>
        </div>
        <div className="mb-5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Amount (USD)</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input type="number" autoFocus step="100"
              className="w-full bg-white/[0.06] border border-white/[0.15] rounded-lg pl-7 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/60"
              value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 1000" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold" onClick={submit} disabled={isPending}>
            {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <DollarSign size={14} className="mr-1" />}Add Funds
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InvestmentsClient({ plans, investment, usdBalance }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showAddFunds, setShowAddFunds] = useState(false);

  function handleSuccess() {
    setSelectedPlan(null);
    setShowAddFunds(false);
    window.location.reload();
  }

  const cfg = investment ? (STATUS_CFG[investment.status] ?? STATUS_CFG.CANCELLED) : null;
  const roi = investment && investment.amount > 0 ? (investment.totalEarned / investment.amount) * 100 : 0;
  const isActive = investment?.status === "ACTIVE";

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Investments</h1>
        <p className="text-sm text-slate-500 mt-0.5">Choose a plan and grow your portfolio automatically</p>
      </div>

      {investment && investment.status !== "CANCELLED" ? (
        <div className="space-y-5">
          <div className="glass-card rounded-2xl border border-sky-500/20 overflow-hidden">
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/[0.05]">
              <div>
                {cfg && (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border mb-2 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                    <cfg.Icon size={11} /> {cfg.label}
                  </span>
                )}
                <h2 className="text-xl font-extrabold text-white">{investment.planName}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{investment.minProfit}%–{investment.maxProfit}% per cycle</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-extrabold text-emerald-400">{formatCurrency(investment.totalEarned)}</div>
                <div className="text-xs text-slate-500 mt-0.5">total earned</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04]">
              {[
                { label: "Invested",     value: formatCurrency(investment.amount),                                        color: "text-white" },
                { label: "Total Earned", value: formatCurrency(investment.totalEarned),                                   color: "text-emerald-400" },
                { label: "ROI",          value: `${roi >= 0 ? "+" : ""}${roi.toFixed(2)}%`,                               color: "text-sky-400" },
                { label: "Cycle",        value: `${investment.profitInterval}s–${investment.maxInterval}s`,               color: "text-slate-300" },
              ].map(s => (
                <div key={s.label} className="px-6 py-5 bg-[#040f1f]">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">{s.label}</div>
                  <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
            {isActive && (
              <div className="px-6 py-4 flex flex-wrap gap-3 border-t border-white/[0.05]">
                <button onClick={() => setShowAddFunds(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors shadow-lg shadow-sky-500/20">
                  <Plus size={14} /> Add Funds
                </button>
                <a href="/dashboard/support">
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-white text-sm font-medium transition-colors">
                    Upgrade Plan
                  </button>
                </a>
              </div>
            )}
          </div>
          <div className="glass-card rounded-xl p-5 border border-white/[0.07]">
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">How your investment works</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your plan earns <span className="text-white">{investment.minProfit}%–{investment.maxProfit}%</span> per cycle,
                  at a random interval between <span className="text-white">{investment.profitInterval}s</span> and{" "}
                  <span className="text-white">{investment.maxInterval}s</span>. Profits go directly to your USD wallet.
                  Contact <a href="/dashboard/support" className="text-sky-400 hover:text-sky-300">support</a> to upgrade.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {plans.length === 0 ? (
            <div className="glass-card rounded-2xl p-14 text-center border border-white/[0.07]">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/[0.08] flex items-center justify-center mx-auto mb-5">
                <TrendingUp size={28} className="text-sky-400/50" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">No Plans Available Yet</h2>
              <p className="text-sm text-slate-500 mb-7 max-w-sm mx-auto leading-relaxed">
                Investment plans haven&apos;t been configured. Make a deposit and contact support.
              </p>
              <a href="/dashboard/deposit">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors shadow-lg shadow-sky-500/25">
                  <ArrowDownToLine size={14} /> Make a Deposit
                </button>
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <span className="text-sm text-slate-400">Your USD Balance</span>
                <span className="text-base font-extrabold text-white">{formatCurrency(usdBalance)}</span>
              </div>
              {usdBalance === 0 && (
                <div className="px-4 py-3 rounded-xl bg-yellow-500/[0.08] border border-yellow-500/20 text-sm text-yellow-400 flex items-center gap-2">
                  <ArrowDownToLine size={14} className="flex-shrink-0" />
                  <span>You need to <a href="/dashboard/deposit" className="font-bold underline underline-offset-2">make a deposit</a> before investing.</span>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {plans.map(plan => <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />)}
              </div>
            </>
          )}
        </div>
      )}

      {selectedPlan && (
        <InvestModal plan={selectedPlan} usdBalance={usdBalance} onClose={() => setSelectedPlan(null)} onSuccess={handleSuccess} />
      )}
      {showAddFunds && investment && (
        <AddFundsModal investment={investment} usdBalance={usdBalance} onClose={() => setShowAddFunds(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
"""

# ─────────────────────────────────────────────────────────────────────────────
# 4.  dashboard/investments/page.tsx  (server)
# ─────────────────────────────────────────────────────────────────────────────
INV_PAGE = """\
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAvailablePlans } from "@/lib/actions/investment";
import type { Metadata } from "next";
import InvestmentsClient from "./investments-client";

export const metadata: Metadata = { title: "Investments \\u2014 VaultEx" };

export default async function InvestmentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [plansRaw, investment, usdWallet] = await Promise.all([
    getAvailablePlans(),
    db.userInvestment.findUnique({ where: { userId } }),
    db.wallet.findFirst({ where: { userId, currency: "USD" } }),
  ]);

  const plans = plansRaw.map((p: any) => ({
    id: p.id, name: p.name, description: p.description,
    minAmount:      Number(p.minAmount),
    minProfit:      Number(p.minProfit), maxProfit: Number(p.maxProfit),
    profitInterval: p.profitInterval,
    maxInterval:    p.maxInterval ?? p.profitInterval,
    isActive:       p.isActive,
  }));

  const inv = investment ? {
    planName:       investment.planName,
    amount:         Number(investment.amount),
    totalEarned:    Number(investment.totalEarned),
    minProfit:      Number(investment.minProfit),
    maxProfit:      Number(investment.maxProfit),
    profitInterval: investment.profitInterval,
    maxInterval:    investment.maxInterval ?? investment.profitInterval,
    status:         investment.status,
  } : null;

  const usdBalance = usdWallet ? Number(usdWallet.balance) : 0;

  return <InvestmentsClient plans={plans} investment={inv} usdBalance={usdBalance} />;
}
"""

# ─────────────────────────────────────────────────────────────────────────────
# 5.  dashboard/copy-trading/copy-trading-client.tsx
# ─────────────────────────────────────────────────────────────────────────────
CT_CLIENT = """\
"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Users, TrendingUp, ArrowDownToLine, DollarSign,
  Loader2, ChevronRight, StopCircle,
} from "lucide-react";
import { userStartCopyTrade, stopCopyTrade, getAvailableTraders } from "@/lib/actions/investment";
import { formatCurrency } from "@/lib/utils";

interface Trader {
  id: string; name: string; avatarUrl: string | null; specialty: string | null;
  winRate: number; totalROI: number; followers: number; minCopyAmount: number;
  minProfit: number; maxProfit: number; profitInterval: number; maxInterval: number;
}
interface ActiveTrade {
  id: string; traderName: string; traderId: string; amount: number; totalEarned: number;
  minProfit: number; maxProfit: number; profitInterval: number; maxInterval: number; status: string;
}
interface Props { activeTrades: ActiveTrade[]; stoppedTrades: ActiveTrade[]; usdBalance: number }

function Avatar({ name, avatarUrl, size = "md" }: { name: string; avatarUrl: string | null; size?: "sm" | "md" | "lg" }) {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const cls = size === "lg" ? "w-14 h-14 text-sm" : size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-xs";
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className={`${cls} rounded-xl object-cover flex-shrink-0 border border-white/10`} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />;
  }
  return (
    <div className={`${cls} rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: `hsl(${hue} 55% 22%)`, border: `1px solid hsl(${hue} 55% 32%)` }}>
      {name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
    </div>
  );
}

function CopyModal({ trader, usdBalance, onClose, onSuccess }: {
  trader: Trader; usdBalance: number; onClose: () => void; onSuccess: () => void;
}) {
  const [amount, setAmount] = useState(String(trader.minCopyAmount));
  const [isPending, start] = useTransition();
  const val = parseFloat(amount) || 0;
  const ok = val >= trader.minCopyAmount && val <= usdBalance;

  function submit() {
    if (val < trader.minCopyAmount) { toast.error(`Minimum is ${formatCurrency(trader.minCopyAmount)}`); return; }
    if (val > usdBalance) { toast.error("Insufficient USD balance"); return; }
    start(async () => {
      const r = await userStartCopyTrade({ traderId: trader.id, amount: val });
      if (r.error) { toast.error(r.error); return; }
      toast.success(`Now copying ${trader.name}!`); onSuccess();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card border border-sky-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={trader.name} avatarUrl={trader.avatarUrl} size="md" />
          <div>
            <h3 className="text-base font-bold text-white">{trader.name}</h3>
            <p className="text-xs text-slate-500">{trader.specialty || "Crypto Trader"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Win Rate", value: `${trader.winRate}%`,   color: "text-emerald-400" },
            { label: "Total ROI", value: `+${trader.totalROI}%`, color: "text-sky-400" },
            { label: "Min Copy",  value: formatCurrency(trader.minCopyAmount), color: "text-white" },
          ].map(s => (
            <div key={s.label} className="px-2 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-center">
              <div className="text-[10px] text-slate-500 mb-0.5">{s.label}</div>
              <div className={`text-xs font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="mb-4 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 flex justify-between">
          <span className="text-xs text-slate-500">Your USD Balance</span>
          <span className="text-sm font-bold text-white">{formatCurrency(usdBalance)}</span>
        </div>
        <div className="mb-5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Copy Amount (USD)</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input type="number" autoFocus step="100"
              className="w-full bg-white/[0.06] border border-white/[0.15] rounded-lg pl-7 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500/60"
              value={amount} onChange={e => setAmount(e.target.value)} min={trader.minCopyAmount} />
          </div>
          {val > 0 && val > usdBalance && <p className="text-[11px] text-red-400 mt-1">Insufficient balance</p>}
          {val > 0 && val < trader.minCopyAmount && <p className="text-[11px] text-yellow-400 mt-1">Below minimum of {formatCurrency(trader.minCopyAmount)}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold" onClick={submit} disabled={isPending || !ok}>
            {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <DollarSign size={14} className="mr-1" />}Start Copying
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CopyTradingClient({ activeTrades: initActive, stoppedTrades, usdBalance }: Props) {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loadingTraders, setLoadingTraders] = useState(true);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>(initActive);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [stoppingId, setStoppingId] = useState<string | null>(null);
  const [, start] = useTransition();

  useEffect(() => {
    getAvailableTraders().then((data: any[]) => {
      setTraders(data.map(t => ({
        ...t, winRate: Number(t.winRate), totalROI: Number(t.totalROI),
        minCopyAmount: Number(t.minCopyAmount), minProfit: Number(t.minProfit),
        maxProfit: Number(t.maxProfit), maxInterval: t.maxInterval ?? t.profitInterval,
      })));
      setLoadingTraders(false);
    });
  }, []);

  function handleSuccess() { setSelectedTrader(null); window.location.reload(); }

  async function handleStop(tradeId: string) {
    if (!confirm("Stop copying this trader?")) return;
    setStoppingId(tradeId);
    start(async () => {
      const r = await stopCopyTrade(tradeId);
      if (r.error) toast.error(r.error);
      else { toast.success("Copy trade stopped"); setActiveTrades(p => p.filter(t => t.id !== tradeId)); }
      setStoppingId(null);
    });
  }

  const copyingIds = new Set(activeTrades.map(t => t.traderId));
  const totalEarned = activeTrades.reduce((s, t) => s + t.totalEarned, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Copy Trading</h1>
          <p className="text-sm text-slate-500 mt-0.5">Mirror top traders and earn automatically</p>
        </div>
        {activeTrades.length > 0 && (
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-extrabold text-emerald-400">{formatCurrency(totalEarned)}</div>
            <div className="text-xs text-slate-500 mt-0.5">{activeTrades.length} active trader{activeTrades.length !== 1 ? "s" : ""}</div>
          </div>
        )}
      </div>

      {activeTrades.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden border border-sky-500/15">
          <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-white">Active Copies</span>
            <span className="ml-auto text-xs text-slate-500">{activeTrades.length} running</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {activeTrades.map(trade => {
              const roi = trade.amount > 0 ? (trade.totalEarned / trade.amount) * 100 : 0;
              return (
                <div key={trade.id} className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <Avatar name={trade.traderName} avatarUrl={null} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{trade.traderName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{trade.minProfit}%–{trade.maxProfit}% / {trade.profitInterval}s–{trade.maxInterval}s</div>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <div className="text-xs text-slate-500 mb-0.5">Copying</div>
                    <div className="text-sm font-bold text-sky-400">{formatCurrency(trade.amount)}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-slate-500 mb-0.5">Earned</div>
                    <div className="text-sm font-extrabold text-emerald-400">{formatCurrency(trade.totalEarned)}</div>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0 w-14">
                    <div className="text-xs text-slate-500 mb-0.5">ROI</div>
                    <div className="text-sm font-bold text-sky-400">{roi >= 0 ? "+" : ""}{roi.toFixed(2)}%</div>
                  </div>
                  <button disabled={stoppingId === trade.id} onClick={() => handleStop(trade.id)}
                    className="flex-shrink-0 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors disabled:opacity-50"
                    title="Stop copying">
                    {stoppingId === trade.id ? <Loader2 size={14} className="animate-spin" /> : <StopCircle size={14} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Users size={14} className="text-sky-400" /> Available Traders
          {loadingTraders && <Loader2 size={12} className="animate-spin text-slate-500" />}
        </h2>

        {!loadingTraders && traders.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/[0.07]">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/[0.08] flex items-center justify-center mx-auto mb-5">
              <Users size={28} className="text-sky-400/50" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Traders Available</h3>
            <p className="text-sm text-slate-500 mb-7 max-w-sm mx-auto">Our team is setting up trader profiles. Make a deposit to get started.</p>
            <a href="/dashboard/deposit">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors shadow-lg shadow-sky-500/25">
                <ArrowDownToLine size={14} /> Make a Deposit
              </button>
            </a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {traders.map(trader => {
              const alreadyCopying = copyingIds.has(trader.id);
              return (
                <div key={trader.id}
                  className={`glass-card rounded-2xl border transition-all overflow-hidden ${alreadyCopying ? "border-emerald-500/30 opacity-80" : "border-sky-500/15 hover:border-sky-500/40 cursor-pointer group"}`}
                  onClick={() => !alreadyCopying && setSelectedTrader(trader)}>
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={trader.name} avatarUrl={trader.avatarUrl} size="lg" />
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{trader.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{trader.specialty || "Crypto Trader"}</div>
                          <div className="text-xs text-slate-600 mt-0.5">{trader.followers.toLocaleString()} followers</div>
                        </div>
                      </div>
                      {alreadyCopying
                        ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex-shrink-0">Copying</span>
                        : <ChevronRight size={16} className="text-slate-600 group-hover:text-sky-400 transition-colors mt-1 flex-shrink-0" />
                      }
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/[0.04] rounded-xl p-2.5">
                        <div className="text-[10px] text-slate-500 mb-0.5">Win Rate</div>
                        <div className="text-sm font-bold text-emerald-400">{trader.winRate}%</div>
                      </div>
                      <div className="bg-white/[0.04] rounded-xl p-2.5">
                        <div className="text-[10px] text-slate-500 mb-0.5">Total ROI</div>
                        <div className="text-sm font-bold text-sky-400">+{trader.totalROI}%</div>
                      </div>
                      <div className="bg-white/[0.04] rounded-xl p-2.5">
                        <div className="text-[10px] text-slate-500 mb-0.5">Profit/Cycle</div>
                        <div className="text-sm font-bold text-white">{trader.minProfit}%–{trader.maxProfit}%</div>
                      </div>
                      <div className="bg-white/[0.04] rounded-xl p-2.5">
                        <div className="text-[10px] text-slate-500 mb-0.5">Min Copy</div>
                        <div className="text-sm font-bold text-white">{formatCurrency(trader.minCopyAmount)}</div>
                      </div>
                    </div>
                  </div>
                  <div className={`px-5 py-3 border-t border-white/[0.05] transition-colors ${alreadyCopying ? "bg-emerald-500/[0.05]" : "bg-sky-500/[0.03] group-hover:bg-sky-500/[0.06]"}`}>
                    <span className={`text-xs font-semibold flex items-center gap-1 ${alreadyCopying ? "text-emerald-400" : "text-sky-400"}`}>
                      <TrendingUp size={11} /> {alreadyCopying ? "Already copying this trader" : "Click to start copying"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {stoppedTrades.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.07]">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <span className="text-sm font-semibold text-slate-500">Past Copies</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {stoppedTrades.map(trade => {
              const roi = trade.amount > 0 ? (trade.totalEarned / trade.amount) * 100 : 0;
              return (
                <div key={trade.id} className="flex items-center gap-3 px-5 py-4 opacity-60">
                  <Avatar name={trade.traderName} avatarUrl={null} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-400 truncate">{trade.traderName}</div>
                    <div className="text-xs text-slate-600">Stopped</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-slate-600 mb-0.5">Earned</div>
                    <div className="text-sm font-bold text-slate-400">{formatCurrency(trade.totalEarned)}</div>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0 w-14">
                    <div className="text-xs text-slate-600 mb-0.5">ROI</div>
                    <div className="text-sm font-bold text-slate-500">{roi >= 0 ? "+" : ""}{roi.toFixed(2)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedTrader && (
        <CopyModal trader={selectedTrader} usdBalance={usdBalance} onClose={() => setSelectedTrader(null)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
"""

# ─────────────────────────────────────────────────────────────────────────────
# 6.  dashboard/copy-trading/page.tsx  (server wrapper)
# ─────────────────────────────────────────────────────────────────────────────
CT_PAGE = """\
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import CopyTradingClient from "./copy-trading-client";

export const metadata: Metadata = { title: "Copy Trading \\u2014 VaultEx" };

export default async function CopyTradingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [copyTrades, usdWallet] = await Promise.all([
    db.userCopyTrade.findMany({ where: { userId }, orderBy: { startedAt: "desc" } }),
    db.wallet.findFirst({ where: { userId, currency: "USD" } }),
  ]);

  function ser(t: any) {
    return {
      id:             t.id,
      traderName:     t.traderName,
      traderId:       t.traderId,
      amount:         Number(t.amount),
      totalEarned:    Number(t.totalEarned),
      minProfit:      Number(t.minProfit),
      maxProfit:      Number(t.maxProfit),
      profitInterval: t.profitInterval,
      maxInterval:    t.maxInterval ?? t.profitInterval,
      status:         t.status,
    };
  }

  const activeTrades  = copyTrades.filter(t => t.status !== "STOPPED").map(ser);
  const stoppedTrades = copyTrades.filter(t => t.status === "STOPPED").map(ser);
  const usdBalance    = usdWallet ? Number(usdWallet.balance) : 0;

  return <CopyTradingClient activeTrades={activeTrades} stoppedTrades={stoppedTrades} usdBalance={usdBalance} />;
}
"""

# ─── Write all files ──────────────────────────────────────────────────────────
files = {
    "app/admin/copy-traders/page.tsx":                     COPY_TRADERS_ADMIN,
    "app/admin/investments/page.tsx":                      INVESTMENTS_ADMIN,
    "app/dashboard/investments/investments-client.tsx":    INV_CLIENT,
    "app/dashboard/investments/page.tsx":                  INV_PAGE,
    "app/dashboard/copy-trading/copy-trading-client.tsx":  CT_CLIENT,
    "app/dashboard/copy-trading/page.tsx":                 CT_PAGE,
}

for rel, content in files.items():
    p = BASE / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    print(f"OK  {rel}  ({len(content)} chars)")
