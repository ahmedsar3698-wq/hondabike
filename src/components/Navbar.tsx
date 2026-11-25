import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppRoute } from '../types/motorcycle';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const NAV_ITEMS: Array<{ label: string; page: 'home' | 'collection' | 'about' | 'contact' | 'admin' }> = [
  { label: 'Home', page: 'home' },
  { label: 'Collection', page: 'collection' },
  { label: 'About Us', page: 'about' },
  { label: 'Contact Us', page: 'contact' },
  { label: 'Admin Panel', page: 'admin' },
];

export function Navbar({ currentRoute, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isNavActive = (page: string) => {
    if (page === 'collection' && currentRoute.page === 'details') return true;
    return currentRoute.page === page;
  };

  const handleLinkClick = (page: 'home' | 'collection' | 'about' | 'contact' | 'admin') => {
    setMobileOpen(false);
    if (page === 'contact') {
      onNavigate({ page: 'contact' });
    } else {
      onNavigate({ page });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0C0E]/92 backdrop-blur-md border-b border-[#1E2128]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D91B24] cursor-pointer"
        >
          HONDA <span className="text-[#D91B24]">BIKE</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item.page);
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleLinkClick(item.page)}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D91B24] ${
                  active ? 'text-white' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#D91B24] transition-transform duration-150 origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('collection')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore Bikes
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-[#E2E4E9] hover:bg-[#17191E] transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#101216] border-b border-[#1E2128]">
          <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item.page);
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleLinkClick(item.page)}
                  className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#191C22] text-white border-b border-[#D91B24]/40'
                      : 'text-[#A1A7B3] hover:bg-[#16181D] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleLinkClick('collection')}
              className="mt-2 w-full px-4 py-3 text-sm font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
            >
              Explore Bikes
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
