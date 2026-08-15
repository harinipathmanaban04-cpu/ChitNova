import React, { useEffect, useMemo, useState } from "react";
import {
  Bell, CalendarDays, ChevronLeft, ChevronRight, CircleDollarSign,
  CreditCard, LayoutDashboard, LogOut, MessageCircle, ReceiptText,
  Ticket, User, Sun, Moon, CheckCircle2, LockKeyhole, Save, Camera, Send
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const dateText = (v) => v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const uploadUrl = (file) => {
  if (!file) return "";
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  return `${base}/uploads/${file}`;
};

export default function Dashboard() {
  const { logout } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("chitnova_theme") === "dark");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const load = async () => {
    const response = await api.get("/dashboard");
    setData(response.data);
  };

  useEffect(() => {
    load().catch((error) => console.error("Dashboard loading error:", error)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("chitnova_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const onPop = () => setActivePage(window.history.state?.chitnovaDashboard ? window.history.state.page || "dashboard" : "dashboard");
    window.history.replaceState({ chitnovaDashboard: true, page: "dashboard" }, "", window.location.href);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const changePage = (page) => {
    setActivePage(page);
    window.history.pushState({ chitnovaDashboard: true, page }, "", window.location.href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="customer-dashboard-loading"><div className="dashboard-loader"/><p>Loading your dashboard...</p></div>;

  const user = data?.user || {};
  const plan = data?.plan || null;
  const payments = data?.payments || [];
  const notifications = data?.notifications || [];
  const installmentPayments = payments.filter((p) => p.paymentType === "installment");
  const paid = installmentPayments.filter((p) => p.status === "paid");
  const pending = installmentPayments.filter((p) => p.status !== "paid");
  const totalScheduled = installmentPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const totalPaid = paid.reduce((s, p) => s + Number(p.amount || 0), 0);
  const remaining = Math.max(0, totalScheduled - totalPaid);
  const nextPayment = pending[0];
  const unread = notifications.filter((n) => !n.read).length;
  const displayName = user.fullName || user.username || "Customer";

  const pageTitle = {
    dashboard: `Welcome back, ${displayName} 👋`, plans: "My Chit Plans", schedule: "Payment Schedule",
    payments: "Payments", slots: "Book Chit Slots", notifications: "Notifications", messages: "Chat with Agent", profile: "My Profile"
  }[activePage] || "Dashboard";
  const pageDescription = {
    dashboard: "Here’s what’s happening with your chit plans.", plans: "View your registered chit plan and current status.",
    schedule: "Track every installment, due date and payment status.", payments: "Total paid and complete payment history.",
    slots: "Book an available slot released by the admin or agent.", notifications: "Payment reminders and important account updates.",
    messages: "Chat directly with your Chitnova support agent.", profile: "View and edit the details you registered with."
  }[activePage];

  return <div className="customer-dashboard">
    <aside className="customer-sidebar">
      <div className="customer-side-brand"><div className="customer-brand-mark">C</div><div className="customer-brand-text">CHITNOVA</div></div>
      <nav className="customer-side-nav">
        <SidebarButton active={activePage} page="dashboard" icon={<LayoutDashboard/>} label="Dashboard" onClick={changePage}/>
        <SidebarButton active={activePage} page="plans" icon={<ReceiptText/>} label="My Plans" onClick={changePage}/>
        <SidebarButton active={activePage} page="schedule" icon={<CalendarDays/>} label="Payment Schedule" onClick={changePage}/>
        <SidebarButton active={activePage} page="payments" icon={<CreditCard/>} label="Payments" onClick={changePage}/>
        <SidebarButton active={activePage} page="slots" icon={<Ticket/>} label="Book Slots" onClick={changePage}/>
        <SidebarButton active={activePage} page="notifications" icon={<Bell/>} label="Notifications" badge={unread} onClick={changePage}/>
        <SidebarButton active={activePage} page="messages" icon={<MessageCircle/>} label="Chat with Agent" onClick={changePage}/>
        <SidebarButton active={activePage} page="profile" icon={<User/>} label="My Profile" onClick={changePage}/>
      </nav>
      <button className="customer-side-logout" onClick={() => { logout(); window.location.href = "/"; }}><LogOut/><span>Logout</span></button>
    </aside>

    <main className="customer-main">
      <header className="customer-topbar">
        <div className="customer-heading"><h1>{pageTitle}</h1><p>{pageDescription}</p></div>
        <div className="customer-user">
          <button className="customer-theme-toggle" onClick={() => setDarkMode(v => !v)} title={darkMode ? "Light theme" : "Dark theme"}>{darkMode ? <Sun/> : <Moon/>}<span>{darkMode ? "Light" : "Dark"}</span></button>
          <button className="customer-user-bell" onClick={() => changePage("notifications")}><Bell/>{unread > 0 && <span className="customer-bell-dot">{unread > 9 ? "9+" : unread}</span>}</button>
          <button className="customer-profile-trigger" onClick={() => changePage("profile")} title="Open My Profile">
            <div className="customer-avatar">{user.photo ? <img src={uploadUrl(user.photo)} alt="Profile"/> : displayName.charAt(0).toUpperCase()}</div>
            <div className="customer-user-name"><strong>{displayName}</strong><span>Customer</span></div><ChevronRight className="customer-user-chevron"/>
          </button>
        </div>
      </header>

      <section className="customer-content">
        {activePage === "dashboard" && <DashboardHome plan={plan} payments={payments} notifications={notifications} totalPaid={totalPaid} remaining={remaining} nextPayment={nextPayment} unread={unread} changePage={changePage} calendarDate={calendarDate} setCalendarDate={setCalendarDate}/>} 
        {activePage === "plans" && <PlansPage plan={plan} changePage={changePage}/>} 
        {activePage === "schedule" && <SchedulePage payments={payments} changePage={changePage}/>} 
        {activePage === "payments" && <PaymentsPage payments={payments} onRefresh={load}/>} 
        {activePage === "slots" && <BookSlotsPage/>}
        {activePage === "notifications" && <NotificationsPage notifications={notifications}/>} 
        {activePage === "messages" && <MessagesPage/>}
        {activePage === "profile" && <ProfilePage user={user} onSaved={load}/>} 
      </section>
    </main>
  </div>;
}

function SidebarButton({ active, page, icon, label, badge, onClick }) {
  return <button type="button" className={`customer-nav-item ${active === page ? "active" : ""}`} onClick={() => onClick(page)}>{icon}<span>{label}</span>{badge > 0 && <b className="side-notification-dot">{badge > 9 ? "9+" : badge}</b>}</button>;
}

function DashboardHome({ plan, payments, notifications, totalPaid, remaining, nextPayment, unread, changePage, calendarDate, setCalendarDate }) {
  return <>
    <div className="customer-stat-grid">
      <StatCard icon={<ReceiptText/>} label="Total Plans" value={plan ? "1" : "0"} helper={plan?.name || "No registered plan"} onClick={() => changePage("plans")}/>
      <StatCard icon={<WalletIcon/>} label="Total Paid" value={money(totalPaid)} helper={`${payments.filter(p => p.paymentType === "installment" && p.status === "paid").length} payment months paid`} onClick={() => changePage("payments")}/>
      <StatCard icon={<CalendarDays/>} label="Upcoming Payment" value={money(nextPayment?.amount)} helper={nextPayment ? `Due ${dateText(nextPayment.dueDate)}` : "No pending payment"} onClick={() => changePage("schedule")}/>
      <StatCard icon={<CircleDollarSign/>} label="Remaining" value={money(remaining)} helper="Balance on scheduled installments" onClick={() => changePage("payments")}/>
    </div>

    <div className="customer-dashboard-grid">
      <section className="customer-card"><CardHeader title="My Chit Plan" link="View Plan" onClick={() => changePage("plans")}/>{plan ? <PlanItem name={plan.name} detail={`${money(plan.monthlyInstallment)} per month • ${plan.members || "—"} Members`} due={nextPayment ? dateText(nextPayment.dueDate) : "—"} amount={nextPayment ? money(nextPayment.amount) : money(plan.monthlyInstallment)}/> : <EmptyState icon={<ReceiptText/>} title="No registered chit plan" text="Your selected plan will appear here after activation."/>}</section>
      <section className="customer-card"><CardHeader title="Payment Schedule" link="View Schedule" onClick={() => changePage("schedule")}/><PaymentCalendar payments={payments} calendarDate={calendarDate} setCalendarDate={setCalendarDate}/></section>
      <section className="customer-card"><CardHeader title="Recent Transactions" link="View All" onClick={() => changePage("payments")}/>{payments.length ? payments.slice(0, 5).map((p, i) => <Transaction payment={p} key={p._id || i}/>) : <div className="transaction-empty">No transactions yet.</div>}</section>
    </div>

    <div className="dashboard-bottom-grid">
      <section className="customer-card"><span className="dashboard-section-label">YOUR AGENT</span><div className="agent-dashboard-row"><div className="agent-dashboard-avatar">A</div><div><strong>Chitnova Support Agent</strong><span>Customer Care</span></div></div><div className="agent-phone">+91 98765 43210</div><button className="agent-message-button" onClick={() => changePage("messages")}><MessageCircle/>Message Agent</button></section>
      <section className="customer-card"><CardHeader title="Latest Notifications" link="See All" onClick={() => changePage("notifications")}/>{notifications.length ? notifications.slice(0, 3).map((n, i) => <div className="dashboard-notification-row" key={n._id || i}><span><Bell/></span><div><strong>{n.title || "Notification"}</strong><p>{n.message}</p></div></div>) : <div className="transaction-empty">No notifications yet.</div>}</section>
    </div>
  </>;
}

function WalletIcon() { return <ReceiptText/>; }
function StatCard({ icon, label, value, helper, onClick }) { return <button type="button" className="customer-stat-card clickable" onClick={onClick}><div className="customer-stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{helper}</small></div></button>; }
function CardHeader({ title, link, onClick }) { return <div className="customer-card-title"><h2>{title}</h2><button type="button" onClick={onClick}>{link}</button></div>; }
function PlanItem({ name, detail, due, amount }) { return <div className="my-plan-row"><span className="my-plan-icon">C</span><div className="my-plan-info"><b>{name}</b><span>{detail}</span></div><span className="plan-active">Active</span><div className="plan-due"><small>Next Due</small><b>{due}</b><strong>{amount}</strong></div></div>; }
function Transaction({ payment }) { const isPaid = payment.status === "paid"; return <div className="transaction-row"><span className={`transaction-icon ${isPaid ? "green" : "orange"}`}>{isPaid ? <CheckCircle2/> : <CircleDollarSign/>}</span><div><b>{isPaid ? `Month ${payment.month} Paid` : `Month ${payment.month} Upcoming`}</b><small>{dateText(payment.paidDate || payment.dueDate)}</small></div><strong className={isPaid ? "green-text" : "orange-text"}>{money(payment.amount)}</strong></div>; }

function PaymentCalendar({ payments, calendarDate, setCalendarDate }) {
  const y = calendarDate.getFullYear(), m = calendarDate.getMonth();
  const due = new Set(), paid = new Set();
  payments.forEach(p => { if (p.dueDate) { const d = new Date(p.dueDate); if (d.getFullYear() === y && d.getMonth() === m) due.add(d.getDate()); } if (p.paidDate) { const d = new Date(p.paidDate); if (d.getFullYear() === y && d.getMonth() === m) paid.add(d.getDate()); } });
  return <div className="dashboard-calendar"><div className="calendar-header"><button onClick={() => setCalendarDate(new Date(y, m - 1, 1))}><ChevronLeft/></button><strong>{calendarDate.toLocaleString("en-IN", { month: "long" })} {y}</strong><button onClick={() => setCalendarDate(new Date(y, m + 1, 1))}><ChevronRight/></button></div><div className="calendar-weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <span key={d}>{d}</span>)}</div><div className="calendar-grid">{calendarDays(y, m).map((cell, i) => <span key={i} className={`${cell.muted ? "muted-day" : ""} ${paid.has(cell.day) ? "paid-day" : ""} ${due.has(cell.day) ? "due-day" : ""}`}>{cell.day}</span>)}</div><div className="calendar-legend"><span><i className="legend-paid"/>Paid</span><span><i className="legend-due"/>Due</span><span><i className="legend-upcoming"/>Upcoming</span></div></div>;
}

function PlansPage({ plan, changePage }) { return <div className="dashboard-page-content"><PageIntro label="MY PLAN" title="My Chit Plan" description="Your registered plan details are loaded from your member account."/>{plan ? <div className="large-plan-card"><div className="large-plan-icon"><ReceiptText/></div><div className="large-plan-details"><span className="plan-status">ACTIVE</span><h2>{plan.name}</h2><p>{plan.benefit || "Your active monthly chit plan."}</p><div className="large-plan-meta"><div><small>Chit Value</small><strong>{money(plan.amount)}</strong></div><div><small>Monthly</small><strong>{money(plan.monthlyInstallment)}</strong></div><div><small>Duration</small><strong>{plan.durationMonths} Months</strong></div><div><small>Members</small><strong>{plan.members}</strong></div></div></div><button className="dashboard-orange-button" onClick={() => changePage("schedule")}>View Schedule</button></div> : <EmptyState icon={<ReceiptText/>} title="No active plan" text="Your registered plan will appear here."/>}</div>; }
function SchedulePage({ payments, changePage }) { return <div className="dashboard-page-content"><PageIntro label="PAYMENT TRACKER" title="Payment Schedule" description="Track every installment, due date and payment status."/><div className="full-schedule-list">{payments.length ? payments.filter(p => p.paymentType === "installment").map((p, i) => <div className="full-schedule-row" key={p._id || i}><span className="full-month">{String(p.month).padStart(2, "0")}</span><div><strong>Month {p.month}</strong><small>Due {dateText(p.dueDate)}</small></div><strong className="schedule-amount">{money(p.amount)}</strong><span className={`schedule-status ${p.status}`}>{p.status === "paid" ? "Paid" : p.dueDate && new Date(p.dueDate) < new Date() ? "Overdue" : "Upcoming"}</span>{p.status !== "paid" && <button className="schedule-pay" onClick={() => changePage("payments")}>Pay</button>}</div>) : <EmptyState icon={<CalendarDays/>} title="No payment schedule" text="Your schedule will appear after a plan is activated."/>}</div></div>; }

function PaymentsPage({ payments, onRefresh }) {
  const [busyMonth, setBusyMonth] = useState(null);
  const [message, setMessage] = useState("");
  const rows = payments.filter(p => p.paymentType === "installment");
  const totalScheduled = rows.reduce((s, p) => s + Number(p.amount || 0), 0);
  const totalPaid = rows.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount || 0), 0);
  const remaining = Math.max(0, totalScheduled - totalPaid);
  let cumulative = 0;
  const payMonth = async (month) => {
    setBusyMonth(month); setMessage("");
    try {
      const r = await api.post("/payments/months", { months: [month], paymentMethod: "upi" });
      setMessage(`${money(r.data.amount)} payment recorded for month ${month}.`);
      await onRefresh();
    } catch (e) { setMessage(e.response?.data?.message || "Unable to process this payment."); }
    finally { setBusyMonth(null); }
  };
  return <div className="dashboard-page-content"><PageIntro label="PAYMENTS" title="Total Paid & Payment History" description="A complete view of your scheduled amount, paid amount, remaining balance and monthly payment history."/>
    {message && <div className="payment-message">{message}</div>}
    <div className="payment-summary-grid"><div><span>Total Scheduled</span><strong>{money(totalScheduled)}</strong></div><div><span>Total Paid</span><strong>{money(totalPaid)}</strong></div><div><span>Remaining</span><strong>{money(remaining)}</strong></div><div><span>Paid Months</span><strong>{rows.filter(p => p.status === "paid").length} / {rows.length}</strong></div></div>
    <div className="full-schedule-list payment-history-table"><div className="payment-history-head"><span>Month</span><span>Due Date</span><span>Paid Date</span><span>Status</span><span>Amount</span><span>Total Paid</span><span>Action</span></div>{rows.length ? rows.map((p, i) => { if (p.status === "paid") cumulative += Number(p.amount || 0); return <div className="payment-history-row" key={p._id || i}><strong>{String(p.month).padStart(2, "0")}</strong><span>{dateText(p.dueDate)}</span><span>{p.status === "paid" ? dateText(p.paidDate) : "—"}</span><span className={`schedule-status ${p.status}`}>{p.status === "paid" ? "PAID" : p.dueDate && new Date(p.dueDate) < new Date() ? "DUE" : "UPCOMING"}</span><b>{money(p.amount)}</b><b className="cumulative-paid">{money(cumulative)}</b>{p.status === "paid" ? <span className="payment-action-done"><CheckCircle2 size={14}/>Paid</span> : <button className="schedule-pay" disabled={busyMonth === p.month} onClick={() => payMonth(p.month)}>{busyMonth === p.month ? "…" : "Pay"}</button>}</div>; }) : <EmptyState icon={<CreditCard/>} title="No payment history" text="Your payment schedule will appear here."/>}</div>
  </div>;
}

function BookSlotsPage() {
  const [releases, setReleases] = useState([]), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const load = () => api.get("/slots").then(r => setReleases(r.data));
  useEffect(() => { load().catch(e => setMessage(e.response?.data?.message || "Unable to load slots.")); }, []);
  const book = async (id, slot) => { setBusy(true); setMessage(""); try { const r = await api.post(`/slots/${id}/book`, { slotNumber: slot }); setMessage(r.data.message); await load(); } catch (e) { setMessage(e.response?.data?.message || "Unable to book slot."); } finally { setBusy(false); } };
  return <div className="dashboard-page-content"><PageIntro label="SLOT BOOKING" title="Book Chit Slots" description="Admin and agent slot releases appear here automatically. Only available slots can be booked."/>{message && <div className="slot-message">{message}</div>}{!releases.length ? <EmptyState icon={<Ticket/>} title="No open slots" text="When the admin or agent releases a scheme, its slots will appear here."/> : releases.map(r => { const booked = new Set((r.bookedSlots || []).map(b => Number(b.slotNumber))); const mine = (r.bookedSlots || []).find(b => b.isMine); return <section className="slot-release-card" key={r._id}><div className="slot-release-header"><div><span className="dashboard-section-label">OPEN SCHEME</span><h2>{r.title}</h2><p>{r.description || "Book one available slot for this chit scheme."}</p>{r.plan && <div className="slot-plan-details"><span><b>Chit Value</b>{money(r.plan.amount)}</span><span><b>Monthly</b>{money(r.plan.monthlyInstallment)}</span><span><b>Duration</b>{r.plan.durationMonths} months</span><span><b>Members</b>{r.plan.members}</span></div>}</div><div className="slot-count"><strong>{Math.max(0, r.slotCount - booked.size)}</strong><span>slots left</span></div></div>{mine && <div className="slot-mine"><CheckCircle2/>You booked Slot {mine.slotNumber}.</div>}<div className="slot-grid">{Array.from({ length: r.slotCount }, (_, i) => i + 1).map(slot => { const isBooked = booked.has(slot), isMine = mine?.slotNumber === slot; return <button key={slot} className={`slot-button ${isBooked ? "booked" : "available"} ${isMine ? "mine" : ""}`} disabled={isBooked || busy || !!mine} onClick={() => book(r._id, slot)}>{isMine ? <CheckCircle2 size={16}/> : isBooked ? <LockKeyhole size={15}/> : slot}</button>; })}</div><div className="slot-legend"><span><i className="slot-open"/>Available</span><span><i className="slot-taken"/>Booked</span><span><i className="slot-you"/>Your slot</span></div></section>; })}</div>;
}

function NotificationsPage({ notifications }) { useEffect(() => { api.put("/notifications/read").catch(() => {}); }, []); return <div className="dashboard-page-content"><PageIntro label="UPDATES" title="Notifications" description="All notifications sent to your account by Chitnova admin or agent, plus payment and slot updates."/><div className="notification-page-list">{notifications.length ? notifications.map((n, i) => <div className="notification-page-item" key={n._id || i}><div className="notification-page-icon"><Bell/></div><div><strong>{n.title || "Notification"}</strong><p>{n.message}</p><small>{dateText(n.createdAt)}</small></div></div>) : <EmptyState icon={<Bell/>} title="No notifications" text="You are all caught up."/>}</div></div>; }

function MessagesPage() { const [messages, setMessages] = useState([]), [text, setText] = useState(""), [busy, setBusy] = useState(false); const load = () => api.get("/messages").then(r => setMessages(r.data)); useEffect(() => { load().catch(() => {}); const t = setInterval(() => load().catch(() => {}), 10000); return () => clearInterval(t); }, []); const send = async e => { e.preventDefault(); if (!text.trim() || busy) return; setBusy(true); try { await api.post("/messages", { text: text.trim() }); setText(""); await load(); } finally { setBusy(false); } }; return <div className="dashboard-feature-page"><div className="feature-icon"><MessageCircle/></div><span className="dashboard-section-label">CUSTOMER SUPPORT</span><h2>Chat with Agent</h2><p>Ask about payments, slots, receipts or account updates. Your conversation is saved to your member account.</p><div className="chat-card"><div className="chat-body">{messages.length ? messages.map(m => <div key={m._id} className={`bubble ${m.sender === "customer" ? "mine" : ""}`}><span>{m.text}</span><small>{new Date(m.createdAt).toLocaleString("en-IN")}</small></div>) : <div className="empty"><p>Start the conversation with your agent.</p></div>}</div><form className="chat-input" onSubmit={send}><input value={text} onChange={e => setText(e.target.value)} placeholder="Write your message…"/><button className="btn primary" disabled={busy}><Send size={17}/></button></form></div></div>; }

function ProfilePage({ user, onSaved }) { const [form, setForm] = useState(user); const [photo, setPhoto] = useState(null); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); useEffect(() => setForm(user), [user]); const preview = photo ? URL.createObjectURL(photo) : uploadUrl(form.photo); const save = async e => { e.preventDefault(); setBusy(true); setMsg(""); const fd = new FormData(); ["fullName", "email", "phone", "address", "chitPersonName"].forEach(k => fd.append(k, form[k] || "")); if (photo) fd.append("photo", photo); try { const r = await api.put("/profile", fd); setForm(r.data.user); setPhoto(null); setMsg("Profile updated successfully."); await onSaved(); } catch (e) { setMsg(e.response?.data?.message || "Unable to update profile."); } finally { setBusy(false); } }; return <div className="dashboard-page-content"><PageIntro label="ACCOUNT" title="My Profile" description="These are the same details you entered during registration. You can edit them at any time."/><form className="dashboard-feature-page profile-dashboard-form" onSubmit={save}><div className="profile-top"><div className="profile-avatar">{preview ? <img src={preview} alt="Profile"/> : (form.fullName || "C").charAt(0).toUpperCase()}</div><label className="btn outline upload-photo"><Camera size={16}/>Upload / Change Photo<input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)}/></label></div><div className="form-grid"><label>Username<input value={form.username || ""} disabled/></label><label>Full Name<input value={form.fullName || ""} onChange={e => setForm({ ...form, fullName: e.target.value })} required/></label><label>Email<input type="email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} required/></label><label>Phone<input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} required/></label><label>Chit Person Name<input value={form.chitPersonName || ""} onChange={e => setForm({ ...form, chitPersonName: e.target.value })}/></label><label>Serial Number<input value={form.serialNo || ""} disabled/></label><label className="span-2">Address<textarea rows="4" value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })}/></label></div>{msg && <div className={`alert ${msg.includes("successfully") ? "success" : "error"}`}>{msg}</div>}<button className="btn primary big" disabled={busy}><Save size={17}/>{busy ? "Saving…" : "Save Changes"}</button></form></div>; }

function PageIntro({ label, title, description }) { return <div className="dashboard-page-intro"><span>{label}</span><h2>{title}</h2><p>{description}</p></div>; }
function EmptyState({ icon, title, text }) { return <div className="dashboard-empty">{icon}<h3>{title}</h3><p>{text}</p></div>; }
function calendarDays(year, month) { const first = new Date(year, month, 1).getDay(), total = new Date(year, month + 1, 0).getDate(), prev = new Date(year, month, 0).getDate(); const a = []; for (let i = first - 1; i >= 0; i--) a.push({ day: prev - i, muted: true }); for (let d = 1; d <= total; d++) a.push({ day: d, muted: false }); let n = 1; while (a.length < 42) a.push({ day: n++, muted: true }); return a; }
