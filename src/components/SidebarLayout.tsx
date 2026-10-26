'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Zap,
  LayoutDashboard,
  Users,
  Wallet,
  Package,
  ShieldCheck,
  LogOut,
  ChevronRight,
  User,
  Layers,
  Menu,
  X,
  Building
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'member' | 'admin';
  };
  breadcrumbs?: { label: string; href?: string }[];
}

export default function SidebarLayout({ children, user, breadcrumbs }: SidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = user.role === 'admin';

  const memberNavItems = [
    { label: 'Overview Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Matrix Network', href: '/dashboard', icon: Layers },
    { label: 'Wallet & Earnings', href: '/dashboard', icon: Wallet },
    { label: 'Protein Kit Order', href: '/dashboard', icon: Package },
  ];

  const adminNavItems = [
    { label: 'Admin Control Center', href: '/admin', icon: ShieldCheck },
    { label: 'Distributor Directory', href: '/admin', icon: Users },
    { label: 'Order Fulfillment', href: '/admin', icon: Package },
  ];

  const navItems = isAdmin ? adminNavItems : memberNavItems;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">

      {/* Top Header Bar */}
      <header className="h-16 border-b border-cyan-500/20 glass-panel bg-slate-950/80 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 p-0.5 shadow-neon">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-base font-extrabold tracking-wider text-white hidden sm:inline-block">
              ORBIT<span className="text-cyan-400 font-light">NUTRITION</span>
            </span>
          </Link>
        </div>

        {/* Top Right Profile Dropdown Pill */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold font-mono flex items-center justify-center border border-cyan-500/40">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-white block truncate max-w-[120px]">{user.name}</span>
              <span className="text-[10px] text-cyan-400 font-mono block uppercase">{user.id}</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-90' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl py-2 bg-slate-950 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-slate-400 text-[10px] font-mono">{user.email}</p>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left px-4 py-2 hover:bg-slate-800/60 text-slate-200 flex items-center space-x-2"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Member Portal</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-800/60 text-slate-200 flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Admin Control Panel</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-950/40 text-red-400 flex items-center space-x-2 border-t border-slate-800 mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex relative">

        {/* Left Sidebar Layout (Desktop) */}
        <aside className="w-64 border-r border-cyan-500/20 glass-panel bg-slate-950/60 flex-shrink-0 hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">

          <div className="space-y-6">

            {/* User Profile Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-cyan-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-neon">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-white text-sm truncate">{user.name}</h4>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                    {user.role === 'admin' ? 'SYSTEM ADMIN' : `DISTRIBUTOR (${user.id})`}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block px-3 mb-2 font-bold">
                MENU NAVIGATION
              </span>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-neon-strong'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors px-3 py-1.5"
            >
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Back to Public Site</span>
            </Link>
            <div className="text-[10px] font-mono text-slate-600 px-3">
              ORBIT 10-Matrix v2026.1
            </div>
          </div>

        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
            <div className="relative w-64 glass-panel bg-slate-950 border-r border-cyan-500/20 p-4 flex flex-col justify-between z-50">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="font-extrabold text-cyan-400 text-sm">Orbit Navigation</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
                      >
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">

          {/* Breadcrumbs Trail */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  {idx > 0 && <span className="text-slate-600">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-cyan-400 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-cyan-400 font-bold">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          )}

          {children}

        </main>

      </div>

    </div>
  );
}
