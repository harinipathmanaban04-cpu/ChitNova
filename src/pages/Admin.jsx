import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { BellPlus, Users, Send, Ticket, LockKeyhole } from "lucide-react";

export default function Admin() {
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [releases, setReleases] = useState([]);
  const [form, setForm] = useState({ title: "Payment update", message: "Your next installment reminder is now available.", userId: "" });
  const [slotForm, setSlotForm] = useState({ title: "", planId: "", slotCount: 20, description: "", status: "open" });
  const [msg, setMsg] = useState("");
  const [slotMsg, setSlotMsg] = useState("");

  const load = async () => {
    const [customersRes, plansRes, releasesRes] = await Promise.all([
      api.get("/admin/customers"),
      api.get("/plans"),
      api.get("/admin/slot-releases")
    ]);
    setCustomers(customersRes.data);
    setPlans(plansRes.data);
    setReleases(releasesRes.data);
  };

  useEffect(() => { load().catch((e) => setMsg(e.response?.data?.message || "Unable to load admin data.")); }, []);

  const send = async (e) => {
    e.preventDefault();
    await api.post("/admin/notifications", form);
    setMsg("Notification sent successfully.");
  };

  const releaseSlots = async (e) => {
    e.preventDefault(); setSlotMsg("");
    try {
      await api.post("/admin/slot-releases", { ...slotForm, slotCount: Number(slotForm.slotCount) });
      setSlotMsg("Chit slots released successfully. Customers can now see them automatically.");
      setSlotForm({ title: "", planId: "", slotCount: 20, description: "", status: "open" });
      await load();
    } catch (e) { setSlotMsg(e.response?.data?.message || "Unable to release slots."); }
  };

  const closeRelease = async (id) => {
    await api.patch(`/admin/slot-releases/${id}/close`);
    await load();
  };

  return (
    <div className="page section narrow">
      <div className="page-title"><span className="eyebrow">ADMIN CONSOLE</span><h1>Customer communications & chit slots</h1><p>Send notifications and release bookable chit schemes for customers.</p></div>
      <div className="admin-grid">
        <section className="panel"><div className="panel-head"><div><span className="eyebrow">NEW NOTIFICATION</span><h2>Send an update</h2></div><BellPlus color="#f97316"/></div><form className="auth-form" onSubmit={send}><label>Audience<select value={form.userId} onChange={e=>setForm({...form,userId:e.target.value})}><option value="">All customers</option>{customers.map(c=><option key={c._id} value={c._id}>{c.fullName} • {c.username}</option>)}</select></label><label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></label><label>Message<textarea rows="5" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required/></label><button className="btn primary"><Send size={16}/>Send Notification</button>{msg&&<div className="alert success">{msg}</div>}</form></section>
        <section className="panel"><div className="panel-head"><div><span className="eyebrow">MEMBERS</span><h2>Customers</h2></div><Users color="#f97316"/></div><div className="schedule-list">{customers.map(c=><div className="schedule-row" key={c._id}><span className="month">{c.fullName?.[0]}</span><div><b>{c.fullName}</b><small>{c.email}</small></div><strong>{c.plan?.name||"Pending plan"}</strong></div>)}{!customers.length&&<div className="empty"><Users/><p>No customers yet.</p></div>}</div></section>
      </div>

      <section className="panel admin-slot-panel">
        <div className="panel-head"><div><span className="eyebrow">BOOK SLOT MANAGEMENT</span><h2>Release a Chit Scheme</h2><p>Open 20 or more customer slots like a cinema-style booking screen.</p></div><Ticket color="#f97316"/></div>
        <form className="auth-form admin-slot-form" onSubmit={releaseSlots}>
          <label>Scheme title<input value={slotForm.title} onChange={e=>setSlotForm({...slotForm,title:e.target.value})} placeholder="Example: ₹2 Lakh Chit - July Batch" required/></label>
          <label>Linked plan<select value={slotForm.planId} onChange={e=>setSlotForm({...slotForm,planId:e.target.value})}><option value="">No linked plan</option>{plans.map(p=><option value={p._id} key={p._id}>{p.name} • {p.monthlyInstallment?.toLocaleString("en-IN")}/month</option>)}</select></label>
          <label>Number of slots<input type="number" min="1" max="500" value={slotForm.slotCount} onChange={e=>setSlotForm({...slotForm,slotCount:e.target.value})} required/></label>
          <label>Description<textarea rows="3" value={slotForm.description} onChange={e=>setSlotForm({...slotForm,description:e.target.value})} placeholder="Full scheme details shown to customers"/></label>
          <button className="btn primary"><Ticket size={16}/>Release Slots</button>
          {slotMsg&&<div className="alert success">{slotMsg}</div>}
        </form>
      </section>

      <section className="panel">
        <div className="panel-head"><div><span className="eyebrow">LIVE RELEASES</span><h2>Slot Schemes</h2></div><LockKeyhole color="#f97316"/></div>
        <div className="slot-admin-list">
          {releases.map(r=><div className="slot-admin-row" key={r._id}><div><strong>{r.title}</strong><small>{r.plan?.name || "No linked plan"} • {r.bookedSlots?.length || 0}/{r.slotCount} booked</small></div><span className={`admin-release-status ${r.status}`}>{r.status}</span>{r.status === "open" && <button className="schedule-pay" onClick={()=>closeRelease(r._id)}>Close</button>}</div>)}
          {!releases.length && <p className="muted">No slot releases yet.</p>}
        </div>
      </section>
    </div>
  );
}
