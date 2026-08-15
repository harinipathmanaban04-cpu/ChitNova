import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UploadCloud, UserRound, MapPin, Phone, Mail, LockKeyhole, FileText } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");
  const [params] = useSearchParams();
  const [form, setForm] = useState({ plan: params.get("plan") || "", username: "", password: "", email: "", phone: "", fullName: "", address: "", chitPersonName: "", serialNo: "" });
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    let alive = true;
    api.get("/plans").then(r => { if (alive) setPlans(Array.isArray(r.data) ? r.data : []); }).catch(() => { if (alive) setPlansError("Unable to load chit plans. Check that the backend is running."); }).finally(() => { if (alive) setPlansLoading(false); });
    return () => { alive = false; };
  }, []);

  const change = (e) => setForm(v => ({ ...v, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setDone(false); setBusy(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("photo", photo);
    if (document) fd.append("document", document);
    try {
      await register(fd);
      setDone(true);
      setTimeout(() => nav("/dashboard", { replace: true }), 500);
    } catch (x) {
      setErr(x.response?.data?.message || "Registration failed. Please check your details and try again.");
    } finally { setBusy(false); }
  };

  return <div className="register-page">
    <div className="register-head"><span className="eyebrow">MEMBER REGISTRATION</span><h1>Join Chitnova</h1><p>Create your member account. The same registered details will appear in My Profile after sign-in.</p></div>
    <form className="register-form" onSubmit={submit}>
      <section className="form-card"><div className="form-section-title"><span>01</span><div><h3>Choose your plan</h3><p>Select the chit scheme you want to join.</p></div></div><label>Plan / Scheme<select name="plan" value={form.plan} onChange={change} required disabled={plansLoading}><option value="">{plansLoading ? "Loading plans…" : "Select a plan"}</option>{plans.map(p => <option value={p._id} key={p._id}>{p.name} • ₹{Number(p.monthlyInstallment || 0).toLocaleString("en-IN")}/month • {p.durationMonths} months</option>)}</select>{plansError && <small className="field-error">{plansError}</small>}</label></section>
      <section className="form-card"><div className="form-section-title"><span>02</span><div><h3>Personal & contact details</h3><p>These details are used for your account and payment communication.</p></div></div><div className="form-grid"><label>Full name<input name="fullName" value={form.fullName} onChange={change} placeholder="Customer full name" required/><UserRound/></label><label>Chit person name<input name="chitPersonName" value={form.chitPersonName} onChange={change} placeholder="Chit person / nominee name"/></label><label>Gmail<input type="email" name="email" value={form.email} onChange={change} placeholder="you@gmail.com" required/><Mail/></label><label>Contact number<input name="phone" value={form.phone} onChange={change} placeholder="10-digit mobile number" required/><Phone/></label><label className="span-2">Address<textarea name="address" value={form.address} onChange={change} rows="3" placeholder="House / street / city / pincode" required/><MapPin/></label></div></section>
      <section className="form-card"><div className="form-section-title"><span>03</span><div><h3>Account credentials</h3><p>Choose a username that is different from existing members.</p></div></div><div className="form-grid"><label>Username<input name="username" value={form.username} onChange={change} placeholder="Choose a unique username" autoComplete="username" required/></label><label>Password<input type="password" name="password" value={form.password} onChange={change} placeholder="Minimum 8 characters" minLength="8" autoComplete="new-password" required/><LockKeyhole/></label><label>Serial number<input name="serialNo" value={form.serialNo} onChange={change} placeholder="If provided by agent"/></label></div></section>
      <section className="form-card"><div className="form-section-title"><span>04</span><div><h3>Documents & photo</h3><p>JPG, PNG or PDF up to 5 MB.</p></div></div><div className="upload-grid"><label className="upload-box"><UploadCloud/><b>{photo ? photo.name : "Upload profile photo"}</b><span>JPG / PNG</span><input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)}/></label><label className="upload-box"><FileText/><b>{document ? document.name : "Upload document"}</b><span>PDF / JPG / PNG</span><input type="file" accept="image/*,.pdf" onChange={e => setDocument(e.target.files?.[0] || null)}/></label></div></section>
      {err && <div className="alert error">{err}</div>}{done && <div className="alert success">Registration successful. Opening your dashboard…</div>}
      <div className="register-submit"><p>By registering, you agree to Chitnova’s terms and privacy policy.</p><button className="btn primary big" disabled={busy}>{busy ? "Creating account…" : "Create Member Account"}</button></div>
    </form>
    <p className="auth-switch">Already a member? <Link to="/login">Login</Link></p>
  </div>;
}
