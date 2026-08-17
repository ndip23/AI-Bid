'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Documentation', href: '/docs' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

import { BidoraLogo } from '../ui/BidoraLogo';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* CTA Strip */}
      <div className="gradient-bg py-14 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Ready to win more contracts?
          </h2>
          <p className="text-blue-100 text-sm font-medium leading-relaxed">
            Join 500+ enterprise bid management teams discovering matching procurement opportunities faster with AI.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-emerald-800 font-extrabold text-sm shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all"
          >
            <span>Start Free 14-Day Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <BidoraLogo variant="dark" size="lg" showTagline={true} />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-xs">
              The AI-powered procurement intelligence platform trusted by enterprise bid desks to discover, evaluate, and win more government & enterprise contracts.
            </p>

            <div className="flex items-center space-x-3">
              {[
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Github, label: 'GitHub', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Bidora, Inc. All rights reserved.</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
