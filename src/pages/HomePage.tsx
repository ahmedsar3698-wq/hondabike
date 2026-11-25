import { useState, useMemo } from 'react';
import { ArrowRight, GitCompareArrows } from 'lucide-react';
import { motion } from 'motion/react';
import { AppRoute, Motorcycle } from '../types/motorcycle';
import { HERO_SHOWROOM_IMAGE } from '../data/motorcycles';
import { formatDisplayDate, formatPKR } from '../utils/formatters';
import { MotorcycleCard } from '../components/MotorcycleCard';
import { BikeImage } from '../components/BikeImage';

interface HomePageProps {
  motorcycles: Motorcycle[];
  latestPriceUpdateDate: string;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onNavigate: (route: AppRoute, enginePreset?: string) => void;
}

export function HomePage({
  motorcycles,
  latestPriceUpdateDate,
  compareIds,
  onToggleCompare,
  onNavigate,
}: HomePageProps) {
  const featuredBikes = motorcycles.filter((m) => m.isFeatured);
  const displayedFeatured =
    featuredBikes.length > 0 ? featuredBikes.slice(0, 6) : motorcycles.slice(0, 6);

  // Interactive Head-to-Head Comparator state
  const defaultLeftId =
    motorcycles.find((m) => m.id === 'honda-cd-70')?.id || motorcycles[0]?.id || '';
  const defaultRightId =
    motorcycles.find((m) => m.id === 'honda-cg-125')?.id ||
    motorcycles[1]?.id ||
    motorcycles[0]?.id ||
    '';

  const [leftBikeId, setLeftBikeId] = useState(defaultLeftId);
  const [rightBikeId, setRightBikeId] = useState(defaultRightId);

  const leftBike = useMemo(
    () => motorcycles.find((m) => m.id === leftBikeId) || motorcycles[0],
    [motorcycles, leftBikeId]
  );
  const rightBike = useMemo(
    () => motorcycles.find((m) => m.id === rightBikeId) || motorcycles[1] || motorcycles[0],
    [motorcycles, rightBikeId]
  );

  const priceDelta =
    leftBike?.priceConfirmed &&
    rightBike?.priceConfirmed &&
    leftBike.pricePKR !== null &&
    rightBike.pricePKR !== null
      ? Math.abs(rightBike.pricePKR - leftBike.pricePKR)
      : null;

  return (
    <div className="flex flex-col">
      {/* Section 1: Architectural Showroom Hero + Lineup Quick-Jump Strip */}
      <section className="relative w-full min-h-[540px] lg:min-h-[620px] flex flex-col justify-between overflow-hidden bg-[#0B0C0E] border-b border-[#1E2128]">
        <img
          src={HERO_SHOWROOM_IMAGE}
          alt="Honda Bike Pakistan Official Motorcycle Showroom"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/84 to-[#0B0C0E]/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-[#0B0C0E]/45"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 lg:pt-28 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="text-xs sm:text-sm font-medium tracking-wider text-[#E2E4E9] uppercase">
              Atlas Honda Pakistan 2026 Lineup · Updated {formatDisplayDate(latestPriceUpdateDate)}
            </p>

            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] [text-wrap:balance]">
              WELCOME TO HONDA BIKE
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#C7CCD6] leading-relaxed max-w-xl">
              Explore Honda Motorcycles in Pakistan. From the iconic CD 70 and CG 125 to the new
              2026 CG 150, CB 150F, and electric ICON e: at official Atlas Honda PKR prices.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'collection' })}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Explore Bikes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ page: 'about' })}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#E2E4E9] bg-[#16181D]/90 hover:bg-[#1E2128] border border-[#2D313B] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Official Price List</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* 4-Column Displacement Quick-Jump Strip */}
        <div className="relative z-10 w-full border-t border-[#222630]/80 bg-[#0D0F13]/85 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#1E222B]">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'collection' }, '70')}
              className="p-4 sm:p-5 text-left hover:bg-[#15181F] transition-colors cursor-pointer group"
            >
              <p className="text-xs font-mono text-[#D91B24] uppercase">70cc Commuters</p>
              <p className="mt-1 font-display text-sm sm:text-base font-semibold text-white group-hover:text-[#D91B24] transition-colors">
                CD 70 &amp; Dream
              </p>
              <p className="mt-0.5 text-xs text-[#949BA8] font-mono tabular-nums">
                From PKR 159,900
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ page: 'collection' }, '125')}
              className="p-4 sm:p-5 text-left hover:bg-[#15181F] transition-colors cursor-pointer group"
            >
              <p className="text-xs font-mono text-[#D91B24] uppercase">125cc Legends</p>
              <p className="mt-1 font-display text-sm sm:text-base font-semibold text-white group-hover:text-[#D91B24] transition-colors">
                CG 125 · 125S · CB 125F
              </p>
              <p className="mt-0.5 text-xs text-[#949BA8] font-mono tabular-nums">
                From PKR 238,500
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ page: 'collection' }, '150')}
              className="p-4 sm:p-5 text-left hover:bg-[#15181F] transition-colors cursor-pointer group"
            >
              <p className="text-xs font-mono text-[#D91B24] uppercase">150cc New Lineup</p>
              <p className="mt-1 font-display text-sm sm:text-base font-semibold text-white group-hover:text-[#D91B24] transition-colors">
                New CG 150 &amp; CB 150F
              </p>
              <p className="mt-0.5 text-xs text-[#949BA8] font-mono tabular-nums">
                From PKR 449,900
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ page: 'collection' }, 'electric')}
              className="p-4 sm:p-5 text-left hover:bg-[#15181F] transition-colors cursor-pointer group"
            >
              <p className="text-xs font-mono text-[#D91B24] uppercase">Electric &amp; 100cc</p>
              <p className="mt-1 font-display text-sm sm:text-base font-semibold text-white group-hover:text-[#D91B24] transition-colors">
                ICON e: &amp; Pridor
              </p>
              <p className="mt-0.5 text-xs text-[#949BA8] font-mono tabular-nums">
                PKR 211,900 – 419,900
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Featured 2026 Motorcycles */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#1E212A]">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
              2026 Showroom Highlights
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              CD 70, CG 125 &amp; New 2026 Models
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'collection' })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#E2E4E9] hover:text-[#D91B24] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View All {motorcycles.length} Models</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedFeatured.map((bike) => (
            <MotorcycleCard
              key={bike.id}
              motorcycle={bike}
              isCompared={compareIds.includes(bike.id)}
              onToggleCompare={onToggleCompare}
              onViewDetails={(id, color) => onNavigate({ page: 'details', id, color })}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Interactive Head-to-Head Showroom Comparator */}
      {leftBike && rightBike && (
        <section className="bg-[#101216] border-t border-[#1C1F26]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#1E212A]">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
                  <GitCompareArrows className="w-3.5 h-3.5" />
                  <span>Interactive Showroom Tool</span>
                </p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight [text-wrap:balance]">
                  Compare Any Two Honda Motorcycles Side-by-Side
                </h2>
              </div>

              {/* Quick Popular Matchups */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLeftBikeId('honda-cd-70');
                    setRightBikeId('honda-cg-125');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#E2E4E9] bg-[#161920] hover:bg-[#1E222B] border border-[#282C37] rounded-md transition-colors cursor-pointer"
                >
                  CD 70 vs CG 125
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLeftBikeId('honda-cg-125');
                    setRightBikeId('honda-cg-125s');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#E2E4E9] bg-[#161920] hover:bg-[#1E222B] border border-[#282C37] rounded-md transition-colors cursor-pointer"
                >
                  CG 125 vs CG 125S
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLeftBikeId('honda-cg-150');
                    setRightBikeId('honda-cb-150f');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#E2E4E9] bg-[#161920] hover:bg-[#1E222B] border border-[#282C37] rounded-md transition-colors cursor-pointer"
                >
                  CG 150 vs CB 150F
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Bike A Selector Card */}
              <div className="lg:col-span-5 bg-[#14171D] border border-[#232732] rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-medium text-[#8A909E] mb-2">
                    Select First Model
                  </label>
                  <select
                    value={leftBike.id}
                    onChange={(e) => setLeftBikeId(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0E1014] border border-[#282C37] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24] cursor-pointer"
                  >
                    {motorcycles.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.engineLabel})
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 rounded-md overflow-hidden border border-[#222630]">
                    <BikeImage
                      src={leftBike.image}
                      alt={leftBike.name}
                      aspectClassName="aspect-[4/3]"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#1F232D] flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#8A909E]">Official Ex-Factory</p>
                    <p className="font-mono text-lg font-bold text-white tabular-nums">
                      {formatPKR(leftBike.pricePKR, leftBike.priceConfirmed)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'details', id: leftBike.id })}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>

              {/* Center Spec Delta Matrix */}
              <div className="lg:col-span-2 flex flex-col justify-center gap-3 py-2">
                <div className="p-4 bg-[#14171D] border border-[#232732] rounded-lg text-center">
                  <p className="text-[11px] uppercase tracking-wider text-[#8A909E]">
                    Price Difference
                  </p>
                  <p className="mt-1 font-mono text-base font-bold text-[#D91B24] tabular-nums">
                    {priceDelta !== null
                      ? `PKR ${new Intl.NumberFormat('en-PK').format(priceDelta)}`
                      : 'N/A'}
                  </p>
                </div>

                <div className="p-4 bg-[#14171D] border border-[#232732] rounded-lg space-y-3 text-xs">
                  <div>
                    <p className="text-[#8A909E]">Displacement</p>
                    <p className="mt-0.5 font-mono text-white tabular-nums">
                      {leftBike.engineLabel} vs {rightBike.engineLabel}
                    </p>
                  </div>
                  <div className="border-t border-[#1F232D] pt-2.5">
                    <p className="text-[#8A909E]">Gearbox</p>
                    <p className="mt-0.5 text-[#E2E4E9]">
                      {leftBike.transmission.split(' ')[0]} vs {rightBike.transmission.split(' ')[0]}
                    </p>
                  </div>
                  <div className="border-t border-[#1F232D] pt-2.5">
                    <p className="text-[#8A909E]">Ignition</p>
                    <p className="mt-0.5 text-[#E2E4E9]">
                      {leftBike.startingSystem} / {rightBike.startingSystem}
                    </p>
                  </div>
                  <div className="border-t border-[#1F232D] pt-2.5">
                    <p className="text-[#8A909E]">Fuel / Pack</p>
                    <p className="mt-0.5 text-[#E2E4E9] tabular-nums">
                      {leftBike.fuelCapacity} vs {rightBike.fuelCapacity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bike B Selector Card */}
              <div className="lg:col-span-5 bg-[#14171D] border border-[#232732] rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-medium text-[#8A909E] mb-2">
                    Select Second Model
                  </label>
                  <select
                    value={rightBike.id}
                    onChange={(e) => setRightBikeId(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0E1014] border border-[#282C37] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24] cursor-pointer"
                  >
                    {motorcycles.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.engineLabel})
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 rounded-md overflow-hidden border border-[#222630]">
                    <BikeImage
                      src={rightBike.image}
                      alt={rightBike.name}
                      aspectClassName="aspect-[4/3]"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#1F232D] flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#8A909E]">Official Ex-Factory</p>
                    <p className="font-mono text-lg font-bold text-white tabular-nums">
                      {formatPKR(rightBike.pricePKR, rightBike.priceConfirmed)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'details', id: rightBike.id })}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
