'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="relative py-16 bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <span>24/7 Support & Distribution HQ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            We Are Here to <span className="text-gradient-cyan">Support Your Growth</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Have questions about package delivery, matrix spillover, or sponsor registration? Reach out to our dedicated support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Contact Details Left Card */}
          <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Headquarters & Operations</h2>

              <div className="space-y-6 text-sm text-slate-300">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base">Corporate Office & Warehouse</h4>
                    <p className="text-slate-400 text-xs mt-1">
                      Orbit Park, Tower B, Cyber City, Sector 44, Gurugram, Haryana 122003, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base">Distributor Support Email</h4>
                    <p className="text-slate-400 text-xs mt-1">support@orbitnutrition.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base">Toll-Free Helpline</h4>
                    <p className="text-slate-400 text-xs mt-1">+91 (800) 555-ORBIT (Mon - Sat, 9 AM - 7 PM)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Dispatch Banner */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 font-bold">Logistics Status:</span> All ₹6,000 Whey Protein orders are processed within 24 hours of matrix auto-placement.
            </div>
          </div>

          {/* Form Right Card */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-extrabold text-white">Message Delivered Successfully!</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Thank you for reaching out to Orbit Nutrition. Our distributor support executive will contact you within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-cyan-400 font-semibold text-sm border border-cyan-500/30 hover:bg-slate-700"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-3 text-cyan-400 mb-2">
                  <MessageSquare className="w-5 h-5" />
                  <h3 className="text-xl font-bold text-white">Submit Support Ticket</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Order Tracking or Matrix Placement Query"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Message Detail</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your query in detail..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-neon transition-all flex items-center justify-center space-x-2"
                >
                  <span>Submit Support Ticket</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
