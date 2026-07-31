'use client';

import React, { useState } from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { PublicFooter } from '../../components/layout/PublicFooter';
import {
  Sparkles, Mail, Phone, MapPin, MessageCircle,
  Clock, CheckCircle2, Send, ArrowRight,
} from 'lucide-react';

const contactTypes = [
  { id: 'sales', label: 'Sales Enquiry', desc: 'Pricing, plans and enterprise options' },
  { id: 'support', label: 'Technical Support', desc: 'Platform issues or integration help' },
  { id: 'partnership', label: 'Partnership', desc: 'Data feeds, integrations and resellers' },
  { id: 'other', label: 'Other', desc: 'General questions and feedback' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    type: 'sales',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <PublicNav />

      {/* ─── HERO ─── */}
      <section className="hero-mesh pt-32 pb-16 px-6 md:px-10 text-center">
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            We'd love to hear from you
          </h1>
          <p className="text-base text-slate-600 font-medium leading-relaxed">
            Whether you're evaluating AI Bid Copilot for your team, need support, or want to explore a partnership — our team typically responds within 2 business hours.
          </p>
        </div>
      </section>

      {/* ─── MAIN GRID ─── */}
      <section className="py-16 px-6 md:px-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-slate-900">Contact information</h2>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'hello@aibidcopilot.com',
                    sub: 'General & sales enquiries',
                  },
                  {
                    icon: Phone,
                    label: 'Phone (UK)',
                    value: '+44 20 7946 0852',
                    sub: 'Mon–Fri, 9am–6pm GMT',
                  },
                  {
                    icon: Phone,
                    label: 'Phone (US)',
                    value: '+1 (202) 555-0178',
                    sub: 'Mon–Fri, 9am–6pm ET',
                  },
                  {
                    icon: MapPin,
                    label: 'Headquarters',
                    value: '22 Bishopsgate, London EC2N 4BQ',
                    sub: 'United Kingdom',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start space-x-4">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</div>
                        <div className="text-sm font-extrabold text-slate-900 mt-0.5">{item.value}</div>
                        <div className="text-xs text-slate-500 font-medium">{item.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Response SLA card */}
            <div className="glass-panel rounded-2xl p-5 space-y-3 bg-white">
              <div className="flex items-center space-x-2 text-sm font-extrabold text-slate-900">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Response Times</span>
              </div>
              {[
                { type: 'Sales enquiries', sla: '< 2 business hours' },
                { type: 'Technical support', sla: '< 4 business hours' },
                { type: 'Enterprise onboarding', sla: 'Same business day' },
              ].map((r) => (
                <div key={r.type} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{r.type}</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">{r.sla}</span>
                </div>
              ))}
            </div>

            {/* Live chat badge */}
            <div className="glass-panel rounded-2xl p-5 space-y-2 bg-white flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-extrabold text-slate-900">Live Chat Available</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-slate-500 font-medium">Available Mon–Fri 9am–6pm GMT</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="glass-panel rounded-3xl p-12 bg-white text-center space-y-5 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Message received!</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{form.name.split(' ')[0]}</strong>. Our team will get back to you at{' '}
                  <strong>{form.email}</strong> within 2 business hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', type: 'sales', message: '' }); }}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-8 bg-white space-y-6">
                <h2 className="text-xl font-extrabold text-slate-900">Send us a message</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Contact type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      How can we help?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {contactTypes.map((ct) => (
                        <button
                          key={ct.id}
                          type="button"
                          onClick={() => setForm({ ...form, type: ct.id })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            form.type === ct.id
                              ? 'border-blue-600 bg-blue-50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className={`text-xs font-extrabold ${form.type === ct.id ? 'text-blue-700' : 'text-slate-900'}`}>
                            {ct.label}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">{ct.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={set('name')}
                        placeholder="Jane Smith"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="jane@company.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors font-medium"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={set('company')}
                      placeholder="Acme Defense Ltd"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors font-medium"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Tell us about your team, how many tenders you evaluate per month, and what you're looking to achieve..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors font-medium resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl gradient-bg text-white font-extrabold text-sm gradient-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400 font-medium">
                    By submitting, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline font-bold">Privacy Policy</a>.
                    We'll never share your data.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
