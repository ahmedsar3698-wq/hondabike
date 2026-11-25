import { AppRoute } from '../types/motorcycle';
import { formatDisplayDate } from '../utils/formatters';

interface FooterProps {
  latestPriceUpdateDate: string;
  onNavigate: (route: AppRoute) => void;
}

export function Footer({ latestPriceUpdateDate, onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#08090B] border-t border-[#1C1F26] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#1A1D24]">
          <div className="md:col-span-5 space-y-3">
            <div className="font-display text-xl font-bold tracking-tight text-white">
              HONDA <span className="text-[#D91B24]">BIKE</span>
            </div>
            <p className="text-sm text-[#949BA8] leading-relaxed max-w-md">
              Pakistan’s dedicated Honda motorcycle showroom catalog featuring Atlas Honda Limited models,
              official ex-factory PKR pricing, full technical specifications, and showroom inquiry support.
            </p>
            <p className="text-xs text-[#6E7685] tabular-nums">
              Official Price Reference Updated: {formatDisplayDate(latestPriceUpdateDate)}
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#E2E4E9] uppercase">
              Showroom Pages
            </h3>
            <ul className="space-y-2 text-sm text-[#949BA8]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'home' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'collection' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Motorcycle Collection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'about' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Atlas Honda
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'contact' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'admin' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#E2E4E9] uppercase">
              Pakistan Showroom Support
            </h3>
            <div className="space-y-2 text-sm text-[#949BA8]">
              <p>Karachi Flagship Showroom · Pakistan</p>
              <p className="tabular-nums">
                Phone:{' '}
                <a href="tel:03710180514" className="text-[#E2E4E9] hover:text-white transition-colors">
                  03710180514
                </a>
              </p>
              <p>
                Email:{' '}
                <a
                  href="mailto:ahmedsar3698@gmail.com"
                  className="text-[#E2E4E9] hover:text-white transition-colors"
                >
                  ahmedsar3698@gmail.com
                </a>
              </p>
              <p className="text-xs text-[#6E7685] pt-1 leading-relaxed">
                All displayed PKR prices reflect official Atlas Honda ex-factory rates. Regional freight,
                registration, and dealer handling charges may vary by city.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6E7685]">
          <p>© {year} HONDA BIKE Pakistan. All rights reserved.</p>
          <p>Official Atlas Honda Lineup &amp; Technical Reference</p>
        </div>
      </div>
    </footer>
  );
}
