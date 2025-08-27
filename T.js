import React, { useMemo, useState } from "react";

// --- Data model const PLANS = [ { id: "vip1", name: "VIP 1", cost: 1500, daily: 300, days: 30 }, { id: "vip2", name: "VIP 2", cost: 3000, daily: 600, days: 30 }, { id: "vip3", name: "VIP 3", cost: 6000, daily: 1200, days: 30 }, { id: "vip4", name: "VIP 4", cost: 7500, daily: 1500, days: 30 }, { id: "vip5", name: "VIP 5", cost: 10000, daily: 2000, days: 30 }, { id: "vip6", name: "VIP 6", cost: 30000, daily: 6000, days: 30 }, { id: "vip7", name: "VIP 7", cost: 150000, daily: 30000, days: 30 }, { id: "vip8", name: "VIP 8", cost: 200000, daily: 40000, days: 30 }, ];

const SETTINGS = { welcomeBonus: 500, minWithdraw: 500, withdrawFeePercent: 15, minDeposit: 3000, referrals: [ { level: 1, pct: 20 }, { level: 2, pct: 5 }, { level: 3, pct: 1 }, ], };

function formatNaira(n) { return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0, }).format(n); }

function PlanCard({ plan, onSelect }) { const total = plan.daily * plan.days; const roiPct = Math.round(((total - plan.cost) / plan.cost) * 100); return ( <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-all"> <div className="flex items-center justify-between"> <h3 className="text-lg font-semibold">{plan.name}</h3> <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">{plan.days} days</span> </div> <div className="mt-4 grid grid-cols-2 gap-3 text-sm"> <div className="p-3 rounded-xl bg-slate-50"> <div className="text-slate-500">Cost</div> <div className="font-semibold">{formatNaira(plan.cost)}</div> </div> <div className="p-3 rounded-xl bg-slate-50"> <div className="text-slate-500">Daily Earn</div> <div className="font-semibold">{formatNaira(plan.daily)}</div> </div> <div className="p-3 rounded-xl bg-slate-50"> <div className="text-slate-500">Total Earn</div> <div className="font-semibold">{formatNaira(total)}</div> </div> <div className="p-3 rounded-xl bg-slate-50"> <div className="text-slate-500">ROI</div> <div className={font-semibold ${roiPct >= 0 ? "text-emerald-600" : "text-rose-600"}}>{roiPct}%</div> </div> </div> <button onClick={() => onSelect(plan)} className="mt-4 w-full rounded-xl bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400" > Get {plan.name} </button> </div> ); }

function Stat({ label, value, sub }) { return ( <div className="rounded-2xl bg-white/80 backdrop-blur p-5 border border-slate-200"> <div className="text-slate-500 text-sm">{label}</div> <div className="text-xl font-bold">{value}</div> {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>} </div> ) }

function ReferralTable() { return ( <div className="rounded-2xl bg-white/80 backdrop-blur p-5 border border-slate-200"> <div className="flex items-center justify-between"> <h3 className="font-semibold">Referral Program</h3> <span className="text-xs text-slate-500">3 levels</span> </div> <div className="mt-4 grid grid-cols-3 gap-3 text-center"> {SETTINGS.referrals.map(r => ( <div key={r.level} className="rounded-xl bg-slate-50 p-4"> <div className="text-slate-500 text-xs">Level {r.level}</div> <div className="font-semibold">{r.pct}%</div> </div> ))} </div> <div className="mt-3 text-xs text-slate-500">Share your link and earn a percentage when referrals buy plans.</div> </div> ) }

function Calculator() { const [amount, setAmount] = useState(3000); const [daily, setDaily] = useState(600); const [days, setDays] = useState(30); const total = useMemo(() => daily * days, [daily, days]); const fee = useMemo(() => Math.round((SETTINGS.withdrawFeePercent / 100) * total), [total]);

return ( <div className="rounded-2xl bg-white/80 backdrop-blur p-5 border border-slate-200"> <h3 className="font-semibold">Earnings Calculator</h3> <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm"> <div> <label className="text-slate-500">Deposit (₦)</label> <input type="number" value={amount} onChange={e=>setAmount(+e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" /> </div> <div> <label className="text-slate-500">Daily Earn (₦)</label> <input type="number" value={daily} onChange={e=>setDaily(+e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" /> </div> <div> <label className="text-slate-500">Days</label> <input type="number" value={days} onChange={e=>setDays(+e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" /> </div> </div> <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"> <Stat label="Total Earn" value={formatNaira(total)} /> <Stat label="Withdrawal Fee" value={formatNaira(fee)} sub={${SETTINGS.withdrawFeePercent}%} /> <Stat label="Net After Fee" value={formatNaira(total - fee)} /> <Stat label="Welcome Bonus" value={formatNaira(SETTINGS.welcomeBonus)} /> </div> </div> ) }

function Modal({ open, onClose, title, children }) { if (!open) return null; return ( <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}> <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6" onClick={(e)=>e.stopPropagation()}> <div className="flex items-center justify-between"> <h3 className="font-semibold">{title}</h3> <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button> </div> <div className="mt-4">{children}</div> </div> </div> ) }

export default function App() { const [selected, setSelected] = useState(null); const [depositOpen, setDepositOpen] = useState(false); const [withdrawOpen, setWithdrawOpen] = useState(false);

return ( <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50"> {/* Header */} <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200"> <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between"> <div className="font-extrabold text-xl">Elite <span className="text-indigo-600">Investmnt</span></div> <div className="flex items-center gap-2"> <button className="rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 hover:bg-white">Login</button> <button className="rounded-xl px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">Create Account</button> </div> </div> </header>

{/* Hero */}
  <section className="mx-auto max-w-6xl px-4 pt-12 pb-10">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-black leading-tight">Grow your income with curated VIP plans</h1>
        <p className="mt-3 text-slate-600">Earn daily and withdraw anytime from ₦{SETTINGS.minWithdraw}. Referral rewards up to 20% / 5% / 1%.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={()=>setDepositOpen(true)} className="rounded-2xl px-5 py-3 font-medium bg-indigo-600 text-white hover:bg-indigo-700">Deposit</button>
          <button onClick={()=>setWithdrawOpen(true)} className="rounded-2xl px-5 py-3 font-medium border border-slate-300 bg-white hover:bg-slate-50">Withdraw</button>
        </div>
        <div className="mt-4 text-xs text-slate-500">Welcome bonus: <span className="font-semibold text-slate-700">₦{SETTINGS.welcomeBonus}</span> • Withdrawal fee: {SETTINGS.withdrawFeePercent}% • Min deposit: ₦{SETTINGS.minDeposit}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Active Investors" value="12,540" />
        <Stat label="Total Payouts" value={formatNaira(784502310)} />
        <Stat label="Avg. Daily Return" value="4%" />
        <Stat label="Uptime" value="99.9%" />
      </div>
    </div>
  </section>

  {/* Plans */}
  <section className="mx-auto max-w-6xl px-4 pb-10">
    <div className="flex items-end justify-between">
      <h2 className="text-2xl font-bold">Plans</h2>
      <div className="text-slate-500 text-sm">All plans valid for 30 days</div>
    </div>
    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {PLANS.map(p => (
        <PlanCard key={p.id} plan={p} onSelect={(plan)=>setSelected(plan)} />
      ))}
    </div>
  </section>

  {/* Calculator & Referrals */}
  <section className="mx-auto max-w-6xl px-4 pb-14 grid lg:grid-cols-5 gap-6">
    <div className="lg:col-span-3"><Calculator /></div>
    <div className="lg:col-span-2"><ReferralTable /></div>
  </section>

  {/* FAQ */}
  <section className="mx-auto max-w-5xl px-4 pb-16">
    <h2 className="text-2xl font-bold">FAQ</h2>
    <div className="mt-4 grid gap-3">
      {[{
        q: "How do I fund my account?",
        a: "Click Deposit, choose a gateway (bank transfer or crypto USDT), and follow the instructions. Your wallet will be credited once payment is confirmed.",
      }, {
        q: "When can I withdraw?",
        a: `You can request withdrawals any time once you reach the minimum of ₦${SETTINGS.minWithdraw}. A ${SETTINGS.withdrawFeePercent}% processing fee applies.`,
      }, {
        q: "How do referrals work?",
        a: "Share your unique link. When your referrals buy a plan, you earn a percentage across 3 levels: 20% / 5% / 1%.",
      }].map((f,i) => (
        <details key={i} className="rounded-2xl bg-white/80 backdrop-blur p-5 border border-slate-200">
          <summary className="cursor-pointer font-medium">{f.q}</summary>
          <p className="mt-2 text-slate-600 text-sm">{f.a}</p>
        </details>
      ))}
    </div>
  </section>

  {/* Footer */}
  <footer className="border-t border-slate-200 bg-white/60">
    <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 flex flex-wrap gap-4 items-center justify-between">
      <div>© {new Date().getFullYear()} Elite Investmnt. All rights reserved.</div>
      <div className="flex gap-4">
        <a className="hover:text-indigo-600" href="#">Terms</a>
        <a className="hover:text-indigo-600" href="#">Privacy</a>
        <a className="hover:text-indigo-600" href="#">Support</a>
      </div>
    </div>
  </footer>

  {/* Modals */}
  <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected ? `Buy ${selected.name}` : ""}>
    {selected && (
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">Plan cost: <span className="font-semibold">{formatNaira(selected.cost)}</span></div>
        <div className="rounded-xl bg-slate-50 p-3">Daily earn: <span className="font-semibold">{formatNaira(selected.daily)}</span></div>
        <div className="rounded-xl bg-slate-50 p-3">Total after {selected.days} days: <span className="font-semibold">{formatNaira(selected.daily * selected.days)}</span></div>
        <button className="w-full rounded-xl bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700">Continue to Payment</button>
        <p className="text-xs text-slate-500">(Hook this button to your checkout API)</p>
      </div>
    )}
  </Modal>

  <Modal open={depositOpen} onClose={()=>setDepositOpen(false)} title="Deposit">
    <div className="text-sm space-y-3">
      <p>Select a method:</p>
      <div className="grid grid-cols-2 gap-3">
        <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">Bank Transfer (NGN)</button>
        <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">Crypto (USDT)</button>
      </div>
      <p className="text-xs text-slate-500">(Wire these to your payment gateways; on success, credit the wallet.)</p>
    </div>
  </Modal>

  <Modal open={withdrawOpen} onClose={()=>setWithdrawOpen(false)} title="Withdraw">
    <div className="text-sm space-y-3">
      <label className="text-slate-600 text-sm">Amount (min ₦{SETTINGS.minWithdraw})</label>
      <input className="w-full rounded-xl border border-slate-300 p-2" placeholder={`₦${SETTINGS.minWithdraw}+`} />
      <button className="w-full rounded-xl bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700">Request Payout</button>
      <p className="text-xs text-slate-500">(Hook to your payouts API; apply {SETTINGS.withdrawFeePercent}% fee.)</p>
    </div>
  </Modal>
</div>

); }

