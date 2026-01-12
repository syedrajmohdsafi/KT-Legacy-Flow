import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/family', label: 'Ancestry', color: 'text-blue-400' },
    { to: '/silsila', label: 'Silsila', color: 'text-emerald-400' },
    { to: '/guide', label: 'Guide', color: 'text-indigo-400' },
  ];

  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-200">
      
      {/* Top Navigation Bar (Fixed) */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 glass flex items-center justify-between px-4 md:px-8 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-4">
          {!isHome && (
             <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors" title="Go Home">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
             </button>
           )}
          <Link to="/" className="flex items-center gap-3 group">
            {/* LOGO AREA: KT Logo */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-[10px] shadow-lg shadow-blue-900/50 group-hover:scale-105 transition-transform">KT</div>
            <span className="font-black text-white tracking-tight text-lg">Legacy<span className="text-blue-500">Flow</span></span>
          </Link>
        </div>

        {/* Desktop Menu (Right Side) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link 
              key={link.to}
              to={link.to}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === link.to ? 'bg-white/10 text-white border border-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-300 hover:text-white">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#020617] animate-in slide-in-from-right duration-300 flex flex-col">
           <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
             <span className="font-black text-slate-500 uppercase tracking-widest text-xs">Menu</span>
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
           </div>
           <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                 <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></div>
                 <span className="text-xl font-bold text-white">Home</span>
              </Link>
              {navLinks.map(link => (
                <Link 
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border ${location.pathname === link.to ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-white/5 border-white/5'}`}
                >
                  <div className={`text-xl font-bold ${location.pathname === link.to ? 'text-indigo-400' : 'text-slate-300'}`}>{link.label}</div>
                  {location.pathname === link.to && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500"></div>}
                </Link>
              ))}
           </div>
           <div className="p-6 text-center text-[10px] text-slate-600 font-medium">
             Legacy Flow &copy; 2024
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-16 h-full relative overflow-hidden flex flex-col">
        {children}
      </main>

    </div>
  );
};

export default Layout;