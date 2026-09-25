import React, { useState } from 'react';
import { NavPage } from '../types/dsa';
import { Lightbulb, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenProgress?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'visualizer', label: 'Visualizer' },
    { id: 'learn', label: 'Learn' },
    { id: 'practice', label: 'Practice' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Tagline */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-[#FFE135] shadow-[2px_2px_0px_#000] transition-transform group-hover:-translate-y-0.5">
            <Lightbulb className="h-5 w-5 text-black stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 text-[10px] font-black leading-none text-black select-none">
              ✦
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-comic text-xl font-bold tracking-tight text-black">
                DSA ZONE
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 font-mono tracking-tight -mt-0.5">
              See it. Understand it. Master it.
            </p>
          </div>
        </button>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`rounded-full px-4 py-1.5 font-comic text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]'
                    : 'text-slate-800 hover:text-black hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 py-3 shadow-lg">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-xl px-3 py-2 text-left font-comic text-sm font-bold transition-all ${
                    isActive
                      ? 'border-2 border-black bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
