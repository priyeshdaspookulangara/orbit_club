'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Shield, Zap, User, LogOut, Menu, X, ChevronRight, Award } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Brand', href: '/about' },
    { name: 'Business Plan', href: '/business-plan' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 p-0.5 shadow-neon group-hover:shadow-neon-strong transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                ORBIT<span className="text-cyan-400 font-light">NUTRITION</span>
              </span>
              <span className="block text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                10-Matrix Ecosystem
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                    isActive ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-sm font-medium flex items-center space-x-2 transition-all shadow-md"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>{user.name} ({user.id})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 hover:text-red-300 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-semibold text-sm transition-all shadow-neon hover:shadow-neon-strong transform hover:-translate-y-0.5 flex items-center space-x-1"
                >
                  <span>Join Network</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-cyan-500/20 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 font-medium border border-cyan-500/40"
                >
                  Go to {user.role === 'admin' ? 'Admin Portal' : 'User Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-4 py-2 rounded-lg bg-red-950/40 text-red-400 font-medium border border-red-500/30"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 font-medium border border-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold shadow-neon"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
