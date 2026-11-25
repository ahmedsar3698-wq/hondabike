import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { AppRoute, Motorcycle } from '../types/motorcycle';
import { formatDisplayDate } from '../utils/formatters';
import { MotorcycleCard } from '../components/MotorcycleCard';

export type EngineFilter = 'all' | '70' | '100' | '125' | '150' | 'electric';

interface CollectionPageProps {
  motorcycles: Motorcycle[];
  latestPriceUpdateDate: string;
  initialEngineFilter?: EngineFilter;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onNavigate: (route: AppRoute) => void;
}

type PriceBracket = 'all' | 'under-200k' | '200k-350k' | 'above-350k';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'cc-asc';

const ENGINE_TABS: Array<{ id: EngineFilter; label: string }> = [
  { id: 'all', label: 'All Models' },
  { id: '70', label: '70cc' },
  { id: '100', label: '100cc' },
  { id: '125', label: '125cc' },
  { id: '150', label: '150cc' },
  { id: 'electric', label: 'Electric' },
];

export function CollectionPage({
  motorcycles,
  latestPriceUpdateDate,
  initialEngineFilter = 'all',
  compareIds,
  onToggleCompare,
  onNavigate,
}: CollectionPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [engineFilter, setEngineFilter] = useState<EngineFilter>(initialEngineFilter);
  const [priceBracket, setPriceBracket] = useState<PriceBracket>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  useEffect(() => {
    setEngineFilter(initialEngineFilter);
  }, [initialEngineFilter]);

  const filteredMotorcycles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = motorcycles.filter((bike) => {
      if (query) {
        const hay = `${bike.name} ${bike.series} ${bike.engineLabel} ${bike.shortDescription}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }

      if (engineFilter !== 'all') {
        if (engineFilter === '70' && (bike.engineCC < 60 || bike.engineCC > 85)) return false;
        if (engineFilter === '100' && (bike.engineCC < 86 || bike.engineCC > 110)) return false;
        if (engineFilter === '125' && (bike.engineCC < 111 || bike.engineCC > 135)) return false;
        if (engineFilter === '150' && (bike.engineCC < 136 || bike.engineCC > 180)) return false;
        if (engineFilter === 'electric' && bike.engineCC !== 0) return false;
      }

      if (priceBracket !== 'all') {
        if (!bike.priceConfirmed || bike.pricePKR === null) return false;
        if (priceBracket === 'under-200k' && bike.pricePKR >= 200000) return false;
        if (
          priceBracket === '200k-350k' &&
          (bike.pricePKR < 200000 || bike.pricePKR > 350000)
        ) {
          return false;
        }
        if (priceBracket === 'above-350k' && bike.pricePKR <= 350000) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        const pa = a.priceConfirmed && a.pricePKR !== null ? a.pricePKR : Number.MAX_SAFE_INTEGER;
        const pb = b.priceConfirmed && b.pricePKR !== null ? b.pricePKR : Number.MAX_SAFE_INTEGER;
        return pa - pb;
      }
      if (sortBy === 'price-desc') {
        const pa = a.priceConfirmed && a.pricePKR !== null ? a.pricePKR : -1;
        const pb = b.priceConfirmed && b.pricePKR !== null ? b.pricePKR : -1;
        return pb - pa;
      }
      if (sortBy === 'cc-asc') {
        return a.engineCC - b.engineCC;
      }
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      const pa = a.pricePKR ?? Number.MAX_SAFE_INTEGER;
      const pb = b.pricePKR ?? Number.MAX_SAFE_INTEGER;
      return pa - pb;
    });
  }, [motorcycles, searchQuery, engineFilter, priceBracket, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    engineFilter !== 'all' ||
    priceBracket !== 'all' ||
    sortBy !== 'featured';

  const resetFilters = () => {
    setSearchQuery('');
    setEngineFilter('all');
    setPriceBracket('all');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#1E212A]">
        <div>
          <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
            Atlas Honda Pakistan Lineup
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Motorcycle Collection
          </h1>
          <p className="mt-2 text-sm text-[#949BA8] max-w-2xl">
            Browse all officially available Honda motorcycles in Pakistan—including CD 70, CG 125,
            CG 150, CB 150F, and ICON e:. Click Compare on any bikes to inspect specs side-by-side.
          </p>
        </div>
        <div className="text-xs text-[#8A909E] tabular-nums shrink-0">
          Showing {filteredMotorcycles.length} of {motorcycles.length} models · Updated{' '}
          {formatDisplayDate(latestPriceUpdateDate)}
        </div>
      </div>

      {/* Interactive Search & Filter Controls */}
      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-[#8A909E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model (e.g. CD 70, CG 125, CG 150, CB 150F)..."
              aria-label="Search motorcycles by name"
              className="w-full h-11 pl-10 pr-4 bg-[#131519] border border-[#252933] rounded-md text-sm text-white placeholder-[#6E7685] focus:outline-none focus:border-[#D91B24] transition-colors"
            />
          </div>

          <div className="lg:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#8A909E] shrink-0 hidden sm:block" />
            <select
              value={priceBracket}
              onChange={(e) => setPriceBracket(e.target.value as PriceBracket)}
              aria-label="Filter by price range"
              className="w-full h-11 px-3.5 bg-[#131519] border border-[#252933] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24] transition-colors cursor-pointer"
            >
              <option value="all">All Price Ranges (PKR)</option>
              <option value="under-200k">Under PKR 200,000</option>
              <option value="200k-350k">PKR 200,000 – 350,000</option>
              <option value="above-350k">Above PKR 350,000</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort motorcycles"
              className="w-full h-11 px-3.5 bg-[#131519] border border-[#252933] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24] transition-colors cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price-asc">Price: Lowest to Highest</option>
              <option value="price-desc">Price: Highest to Lowest</option>
              <option value="cc-asc">Engine CC: Lowest to Highest</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#131519] border border-[#222630] rounded-lg"
            role="group"
            aria-label="Filter by engine capacity"
          >
            {ENGINE_TABS.map((tab) => {
              const active = engineFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEngineFilter(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#D91B24] text-white'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#1B1F27]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E2E4E9] hover:text-white bg-[#171A20] border border-[#282C37] rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {filteredMotorcycles.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredMotorcycles.map((bike) => (
            <MotorcycleCard
              key={bike.id}
              motorcycle={bike}
              isCompared={compareIds.includes(bike.id)}
              onToggleCompare={onToggleCompare}
              onViewDetails={(id, color) => onNavigate({ page: 'details', id, color })}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 p-12 bg-[#131519] border border-[#222630] rounded-lg text-center">
          <h2 className="font-display text-xl font-semibold text-white">
            No motorcycles match your filters
          </h2>
          <p className="mt-2 text-sm text-[#949BA8] max-w-md mx-auto">
            Try clearing your search keyword or selecting a broader engine capacity and PKR price
            range.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All Motorcycles</span>
          </button>
        </div>
      )}
    </div>
  );
}
