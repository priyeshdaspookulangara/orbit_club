import Link from 'next/link';
import { Zap, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-cyan-500/20 bg-slate-950/90 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 p-0.5 shadow-neon">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-wider text-white">
                ORBIT<span className="text-cyan-400 font-light">NUTRITION</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium 100% pure whey protein powder direct-selling platform with automated company-wide BFS auto-spillover 10-matrix technology.
            </p>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>System Root ID: ORB00000</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-2">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About Brand & Quality
                </Link>
              </li>
              <li>
                <Link href="/business-plan" className="hover:text-cyan-400 transition-colors">
                  10-Matrix Compensation Plan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cyan-400 transition-colors">
                  Become a Distributor
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Highlights */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-2">
              Direct Selling Kit
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between">
                <span>Package Price:</span>
                <span className="text-cyan-400 font-bold">₹6,000</span>
              </li>
              <li className="flex justify-between">
                <span>Protein Powder:</span>
                <span className="text-slate-200">1kg Whey Tub</span>
              </li>
              <li className="flex justify-between">
                <span>Direct Referral:</span>
                <span className="text-emerald-400 font-bold">₹1,000</span>
              </li>
              <li className="flex justify-between">
                <span>Matrix Level Bonus:</span>
                <span className="text-cyan-300 font-bold">₹200 / head</span>
              </li>
              <li className="flex justify-between">
                <span>Matrix Structure:</span>
                <span className="text-slate-300">10-Child 5-Depth</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-2">
              Headquarters
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Orbit Nutrition Park, Cyber City, Sector 44, Gurugram, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>support@orbitnutrition.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>+91 (800) 555-ORBIT</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Orbit Nutrition Pvt. Ltd. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-mono">
            <span>Production-Grade BFS Auto-Spillover Engine</span>
            <span>•</span>
            <span>2026 UI/UX Glassmorphism Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
