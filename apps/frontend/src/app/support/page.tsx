"use client";

import { useState } from "react";
import {
  Headphones, MessageCircle, Mail, Phone, ChevronDown, ChevronUp,
  Search, Package, RotateCcw, CreditCard, Shield, Truck,
  ArrowRight, CheckCircle, Clock, Star, Send, Sparkles, X
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────── */
const HELP_TOPICS = [
  { icon: <Package size={20} />, label: "Orders & Tracking",  color: "#1d4ed8", bg: "#eff6ff", count: 12 },
  { icon: <RotateCcw size={20} />, label: "Returns & Refunds", color: "#059669", bg: "#ecfdf5", count: 8 },
  { icon: <CreditCard size={20} />, label: "Payments & Offers", color: "#b45309", bg: "#fffbeb", count: 6 },
  { icon: <Truck size={20} />, label: "Delivery Issues",       color: "#7c3aed", bg: "#f5f3ff", count: 9 },
  { icon: <Shield size={20} />, label: "Account & Security",   color: "#880808", bg: "#fef2f2", count: 5 },
  { icon: <Star size={20} />, label: "Product & Sellers",      color: "#be185d", bg: "#fff1f2", count: 7 },
];

const FAQS: { q: string; a: string; category: string }[] = [
  { category: "Orders & Tracking", q: "How do I track my order?", a: "Go to My Orders in your account and click on 'Track Shipment' next to your order. You'll see the real-time tracking info and expected delivery date. You'll also receive SMS/email updates at each milestone." },
  { category: "Returns & Refunds", q: "How do I return a product?", a: "Navigate to My Orders, select the delivered item, and tap 'Return / Exchange'. You can choose a pickup appointment. Refunds are processed within 5-7 business days to your original payment method." },
  { category: "Payments & Offers", q: "Can I pay in EMI?", a: "Yes! We support 0% EMI on orders above ₹3,000 with select credit cards (HDFC, ICICI, Axis, Kotak). At checkout, choose 'EMI' and pick your preferred tenure (3, 6, 9, or 12 months)." },
  { category: "Delivery Issues", q: "My order is delayed — what do I do?", a: "Delays can happen due to high volume or weather. Open your order and tap 'Contact Support' with your order ID — our team typically responds within 2 hours. If unresolved in 24h, we'll issue Zynora Pay credits." },
  { category: "Account & Security", q: "How do I change my password?", a: "Go to Profile → Settings → Security → Change Password. You'll need to verify via OTP before setting a new password. We recommend using a strong, unique password and enabling 2FA." },
  { category: "Orders & Tracking", q: "Can I cancel my order?", a: "You can cancel within 2 hours of placing the order or before the item is shipped. Go to My Orders, select your order, and tap 'Cancel Order'. Refunds are immediate for prepaid orders." },
  { category: "Product & Sellers", q: "Are all products on Zynora authentic?", a: "Yes. All sellers on Zynora go through our Verified Seller Program. We conduct periodic audits and offer a 100% Authenticity Guarantee. Any counterfeit item is eligible for a full refund + compensation." },
];

const ACTIVE_TICKETS = [
  { id: "TKT-2024-88431", issue: "Refund not received for order ZYN-20240110-3345", status: "In Progress", date: "Mar 12, 2024", agent: "Priya S." },
];

/* ─── Components ─────────────────────────────────────────── */
function FaqItem({ faq }: { faq: typeof FAQS[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open ? "border-[#880808]/20 shadow-md shadow-red-900/5" : "border-gray-100"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${open ? "bg-red-50/50" : "bg-white hover:bg-gray-50"}`}
      >
        <span className="text-sm font-bold text-gray-800 pr-4">{faq.q}</span>
        {open ? <ChevronUp size={16} className="text-[#880808] shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white border-t border-gray-50 animate-fade-in">
          <p className="text-sm text-gray-600 leading-relaxed pt-4">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Chat Widget ─────────────────────────────────────────── */
const CHAT_MSGS = [
  { from: "bot", text: "Hi! 👋 I'm ZynoBot. How can I help you today?" },
  { from: "bot", text: "You can ask me about orders, returns, payments, or any other issue." },
];

function ChatWidget({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState(CHAT_MSGS);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    setMsgs((prev) => [...prev, { from: "user", text: input }]);
    const q = input;
    setInput("");
    setTimeout(() => {
      setMsgs((prev) => [...prev, { from: "bot", text: `Thanks for your message about "${q}". A support agent will follow up shortly. In the meantime, check our FAQ section for quick answers!` }]);
    }, 900);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up">
      <div className="bg-gradient-to-r from-[#880808] to-rose-700 p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
          <Headphones size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-black text-sm">ZynoBot Support</p>
          <p className="text-white/60 text-[10px] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online · Typically replies instantly</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"><X size={16} /></button>
      </div>
      <div className="flex-1 p-4 space-y-3 max-h-72 overflow-y-auto bg-gray-50/50">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium ${m.from === "user" ? "bg-[#880808] text-white rounded-tr-sm" : "bg-white text-gray-700 border border-gray-100 rounded-tl-sm shadow-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message..."
          className="flex-1 text-sm font-medium text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#880808] focus:ring-2 focus:ring-red-50 transition-all"
        />
        <button onClick={send} className="w-9 h-9 rounded-xl bg-[#880808] flex items-center justify-center text-white hover:bg-[#6d0606] transition-colors shrink-0">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function SupportPage() {
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("All");
  const [chatOpen, setChatOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "Ankit Shukla", email: "ankit.shukla@email.com", orderId: "", category: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const categories = ["All", ...Array.from(new Set(FAQS.map((f) => f.category)))];

  const filteredFaqs = FAQS.filter((f) => {
    const matchCat = faqCategory === "All" || f.category === faqCategory;
    const matchSearch = !faqSearch.trim() || f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[#0f0505] via-[#1f0808] to-[#0f0505] noise overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25" style={{ background: "rgba(136,8,8,0.8)" }} />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full blur-[100px] opacity-15" style={{ background: "rgba(220,38,38,0.5)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest mb-6 bg-white/5">
            <Sparkles size={12} className="text-red-400" /> Zynora Support
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            How can we <span className="gradient-text">help you?</span>
          </h1>
          <p className="text-white/40 text-base max-w-lg mx-auto mb-8">Search our help center or browse topics below. Our team is available 24/7.</p>
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search for help with orders, returns, payments..."
              className="w-full pl-12 pr-5 py-4 bg-white rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-50 shadow-2xl shadow-black/20 border border-transparent focus:border-[#880808] transition-all"
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Quick Contact ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: <MessageCircle size={22} />, title: "Live Chat", sub: "Chat with ZynoBot instantly", action: "Start Chat", color: "#880808", onClick: () => setChatOpen(true) },
            { icon: <Mail size={22} />, title: "Email Us", sub: "support@zynora.in", action: "Send Email", color: "#1d4ed8", onClick: () => {} },
            { icon: <Phone size={22} />, title: "Call Us", sub: "1800-890-0000 · Free", action: "Call Now", color: "#059669", onClick: () => {} },
          ].map((c) => (
            <div key={c.title} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${c.color}15`, color: c.color }}>
                {c.icon}
              </div>
              <h3 className="text-base font-black text-gray-900 mb-0.5">{c.title}</h3>
              <p className="text-xs text-gray-400 mb-4">{c.sub}</p>
              <button onClick={c.onClick} className="flex items-center gap-1.5 text-xs font-bold transition-colors hover:gap-2.5" style={{ color: c.color }}>
                {c.action} <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Active Ticket Banner ── */}
        {ACTIVE_TICKETS.length > 0 && (
          <div className="mb-8 p-5 rounded-3xl bg-amber-50 border border-amber-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-1.5"><Clock size={12} /> Active Support Tickets</p>
            {ACTIVE_TICKETS.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-amber-100">
                <div>
                  <p className="text-xs font-mono font-bold text-amber-700">{t.id}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{t.issue}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.date} · Agent: {t.agent}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200">
                  <Clock size={11} /> {t.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Help Topics ── */}
        <div className="mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-5">Browse by Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {HELP_TOPICS.map((t) => (
              <button
                key={t.label}
                onClick={() => setFaqCategory(t.label)}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all group text-left ${faqCategory === t.label ? "border-[#880808]/20 shadow-md" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"}`}
                style={faqCategory === t.label ? { background: `${t.color}08`, borderColor: `${t.color}25` } : {}}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: t.bg, color: t.color }}>
                  {t.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.label}</p>
                  <p className="text-[10px] text-gray-400">{t.count} articles</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-xl font-black text-gray-900">Frequently Asked Questions</h2>
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((c) => (
                <button key={c} onClick={() => setFaqCategory(c)} className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${faqCategory === c ? "bg-[#880808] text-white" : "text-gray-500 bg-white border border-gray-200 hover:text-gray-800"}`}>{c}</button>
              ))}
            </div>
          </div>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-400 text-sm">No results found for "{faqSearch}"</p>
            </div>
          ) : (
            <div className="space-y-3">{filteredFaqs.map((f, i) => <FaqItem key={i} faq={f} />)}</div>
          )}
        </div>

        {/* ── Contact Form ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
              <Mail size={18} className="text-[#880808]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">Raise a Support Ticket</h2>
              <p className="text-xs text-gray-400">We'll respond within 2-4 hours</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-10 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Ticket Raised! 🎉</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">Our support team has received your request and will get back to you at <span className="font-bold text-gray-700">{formData.email}</span> within 2-4 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-3 rounded-2xl bg-[#880808] text-white text-sm font-bold hover:bg-[#6d0606] transition-colors shadow-md shadow-red-900/20">
                Raise Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Your Name</label>
                <input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#880808] focus:ring-4 focus:ring-red-50 transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#880808] focus:ring-4 focus:ring-red-50 transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Order ID (optional)</label>
                <input value={formData.orderId} onChange={(e) => setFormData((p) => ({ ...p, orderId: e.target.value }))}
                  placeholder="ZYN-20240315-8841"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#880808] focus:ring-4 focus:ring-red-50 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Category</label>
                <select value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#880808] focus:ring-4 focus:ring-red-50 transition-all appearance-none" required>
                  <option value="">Select a topic</option>
                  {HELP_TOPICS.map((t) => <option key={t.label} value={t.label}>{t.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Describe your issue</label>
                <textarea value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} rows={5}
                  placeholder="Please describe your issue in detail..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#880808] focus:ring-4 focus:ring-red-50 transition-all resize-none" required />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-gray-400 flex items-center gap-1.5"><Clock size={12} /> Expected response: <span className="font-bold text-gray-600">2–4 hours</span></p>
                <button type="submit" className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#880808] text-white font-bold text-sm hover:bg-[#6d0606] transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-900/20 active:scale-95">
                  Submit Ticket <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Chat Widget ── */}
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}

      {/* ── Floating Chat Button ── */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#880808] text-white font-bold text-sm shadow-2xl shadow-red-900/30 hover:bg-[#6d0606] hover:scale-105 transition-all animate-pulse-glow"
        >
          <Headphones size={18} /> Live Support
          <span className="w-2 h-2 rounded-full bg-emerald-400 ml-0.5" />
        </button>
      )}
    </div>
  );
}
