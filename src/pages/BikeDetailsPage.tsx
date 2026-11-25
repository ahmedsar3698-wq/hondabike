import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  MessageSquare,
  GitCompareArrows,
  Calculator,
  Maximize2,
  X,
} from 'lucide-react';
import { AppRoute, Motorcycle } from '../types/motorcycle';
import { formatPKR, formatDisplayDate } from '../utils/formatters';
import { BikeImage } from '../components/BikeImage';
import { MotorcycleCard } from '../components/MotorcycleCard';

interface BikeDetailsPageProps {
  motorcycle: Motorcycle | undefined;
  initialColorName?: string;
  allMotorcycles: Motorcycle[];
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onNavigate: (route: AppRoute) => void;
}

export function BikeDetailsPage({
  motorcycle,
  initialColorName,
  allMotorcycles,
  compareIds,
  onToggleCompare,
  onNavigate,
}: BikeDetailsPageProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [tenureMonths, setTenureMonths] = useState(18);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!motorcycle) return;
    if (initialColorName) {
      const idx = motorcycle.colors.findIndex(
        (c) => c.name.toLowerCase() === initialColorName.toLowerCase()
      );
      setSelectedColorIndex(idx >= 0 ? idx : 0);
    } else {
      setSelectedColorIndex(0);
    }
  }, [motorcycle?.id, initialColorName]);

  if (!motorcycle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Motorcycle Not Found</h1>
        <p className="mt-2 text-sm text-[#949BA8]">
          The requested motorcycle model could not be found in the current showroom catalog.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'collection' })}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>
      </div>
    );
  }

  const activeColor = motorcycle.colors[selectedColorIndex] || motorcycle.colors[0];
  const hasDedicatedColorImage = Boolean(activeColor?.image);
  const displayImage = activeColor?.image || motorcycle.image;
  const priceText = formatPKR(motorcycle.pricePKR, motorcycle.priceConfirmed);
  const isCompared = compareIds.includes(motorcycle.id);

  const downPaymentPKR =
    motorcycle.priceConfirmed && motorcycle.pricePKR
      ? Math.round((motorcycle.pricePKR * downPaymentPercent) / 100)
      : 0;
  const remainingPrincipal =
    motorcycle.priceConfirmed && motorcycle.pricePKR
      ? motorcycle.pricePKR - downPaymentPKR
      : 0;
  const estimatedMonthlyPKR =
    remainingPrincipal > 0 ? Math.round(remainingPrincipal / tenureMonths) : 0;

  const relatedModels = allMotorcycles
    .filter((m) => m.id !== motorcycle.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Breadcrumb Back Action */}
      <button
        type="button"
        onClick={() => onNavigate({ page: 'collection' })}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Motorcycle Collection</span>
      </button>

      {/* Contiguous Product Detail Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left: Large Studio Image + Quick Color Strip */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#131519] border border-[#222630] rounded-lg overflow-hidden">
            <div className="relative group">
              <BikeImage
                src={displayImage}
                alt={`${motorcycle.name} - ${activeColor ? activeColor.name : 'Showroom View'}`}
                aspectClassName="aspect-[4/3]"
                tintHex={activeColor?.hex}
                tintName={activeColor?.name}
                applyColorGrade={!hasDedicatedColorImage && selectedColorIndex > 0}
                priority
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open full-screen color view"
                className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0C0E]/80 hover:bg-[#0B0C0E] border border-[#2D313B] rounded-md text-xs font-medium text-white backdrop-blur-sm transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </button>
            </div>

            <div className="px-5 py-3.5 border-t border-[#1E212A] flex flex-wrap items-center justify-between gap-3 text-xs text-[#949BA8]">
              <span>Atlas Honda Pakistan Official Studio View</span>
              {activeColor && (
                <span className="inline-flex items-center gap-2 text-white font-medium">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/30"
                    style={{ backgroundColor: activeColor.hex }}
                  />
                  Showing Color: {activeColor.name}
                </span>
              )}
            </div>
          </div>

          {/* Interactive PKR Down Payment & Monthly Split Guide */}
          {motorcycle.priceConfirmed && motorcycle.pricePKR && (
            <div className="bg-[#131519] border border-[#222630] rounded-lg p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
                <Calculator className="w-4 h-4" />
                <span>PKR Installment &amp; Budget Planner (0% Markup Reference)</span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#949BA8] mb-1.5">
                    Down Payment ({downPaymentPercent}%)
                  </label>
                  <select
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#0E1014] border border-[#262A34] rounded-md text-xs sm:text-sm text-white cursor-pointer focus:outline-none focus:border-[#D91B24]"
                  >
                    <option value={20}>20% Down Payment</option>
                    <option value={25}>25% Down Payment</option>
                    <option value={35}>35% Down Payment</option>
                    <option value={50}>50% Down Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#949BA8] mb-1.5">
                    Installment Tenure
                  </label>
                  <select
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#0E1014] border border-[#262A34] rounded-md text-xs sm:text-sm text-white cursor-pointer focus:outline-none focus:border-[#D91B24]"
                  >
                    <option value={12}>12 Months</option>
                    <option value={18}>18 Months</option>
                    <option value={24}>24 Months</option>
                    <option value={36}>36 Months</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#1F232C] grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A909E]">Estimated Upfront</p>
                  <p className="mt-0.5 font-mono text-sm sm:text-base font-semibold text-white tabular-nums">
                    PKR {new Intl.NumberFormat('en-PK').format(downPaymentPKR)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A909E]">Base Monthly Split ({tenureMonths} mo)</p>
                  <p className="mt-0.5 font-mono text-sm sm:text-base font-semibold text-[#D91B24] tabular-nums">
                    PKR {new Intl.NumberFormat('en-PK').format(estimatedMonthlyPKR)} / mo
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase & Overview Module */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#131519] border border-[#222630] rounded-lg p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#949BA8]">
              <span className="text-[#D91B24] font-semibold uppercase tracking-wider">
                {motorcycle.series}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{motorcycle.engineLabel}</span>
            </div>

            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {motorcycle.name}
            </h1>

            {/* Official PKR Price */}
            <div className="mt-5 pb-5 border-b border-[#20242D]">
              <p className="text-xs text-[#8A909E]">Official Ex-Factory Price (Pakistan)</p>
              <p
                className={`mt-1 font-mono text-2xl sm:text-3xl font-bold tabular-nums ${
                  motorcycle.priceConfirmed && motorcycle.pricePKR ? 'text-white' : 'text-[#F59E0B]'
                }`}
              >
                {priceText}
              </p>
              <p className="mt-1.5 text-xs text-[#949BA8] tabular-nums">
                Last Price Update: {formatDisplayDate(motorcycle.lastUpdated)}
                {motorcycle.priceNote ? ` · ${motorcycle.priceNote}` : ''}
              </p>
            </div>

            <p className="mt-5 text-sm text-[#C7CCD6] leading-relaxed">
              {motorcycle.fullDescription}
            </p>

            {/* Interactive Color Selector */}
            {motorcycle.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#949BA8]">
                  Select Color Finish ({motorcycle.colors.length} Available)
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {motorcycle.colors.map((color, idx) => {
                    const selected = idx === selectedColorIndex;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColorIndex(idx)}
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#1D212A] border-[#D91B24] text-white'
                            : 'bg-[#101216] border-[#252933] text-[#B4BAC6] hover:border-[#3A404F] hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Highlights */}
            {motorcycle.highlights.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {motorcycle.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#C7CCD6]">
                    <Check className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Primary Actions */}
          <div className="mt-8 pt-6 border-t border-[#20242D] flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'contact', preselectedBikeId: motorcycle.id })}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Book / Inquire Now</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(motorcycle.id)}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-md border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-[#2A1418] border-[#D91B24] text-white'
                  : 'bg-[#181B21] hover:bg-[#21252D] border-[#2A2E39] text-[#E2E4E9]'
              }`}
            >
              <GitCompareArrows className="w-4 h-4" />
              <span>{isCompared ? 'Added to Compare' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Technical Specifications Table */}
      <section className="mt-14 bg-[#131519] border border-[#222630] rounded-lg p-6 sm:p-8">
        <div className="pb-5 border-b border-[#20242D]">
          <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
            Engineering Sheet
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white tracking-tight">
            {motorcycle.name} — Full Specifications
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {motorcycle.specifications.map((spec) => (
            <div
              key={spec.label}
              className="py-3.5 border-b border-[#1D2028] flex items-baseline justify-between gap-4"
            >
              <dt className="text-xs sm:text-sm text-[#949BA8] shrink-0">{spec.label}</dt>
              <dd className="text-xs sm:text-sm font-medium text-white text-right tabular-nums">
                {spec.value}
              </dd>
            </div>
          ))}
        </div>
      </section>

      {/* Related Models */}
      {relatedModels.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 pb-6 border-b border-[#1E212A]">
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              More Honda Motorcycles
            </h2>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'collection' })}
              className="text-sm font-medium text-[#E2E4E9] hover:text-[#D91B24] transition-colors cursor-pointer"
            >
              View Full Lineup
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {relatedModels.map((bike) => (
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
      )}

      {/* Full-Screen Color Showroom Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${motorcycle.name} Color Showroom View`}
        >
          <div className="w-full max-w-5xl flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                {motorcycle.name} — {activeColor ? activeColor.name : 'Studio View'}
              </h2>
              <p className="text-xs font-mono text-[#949BA8] tabular-nums">{priceText}</p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close full screen view"
              className="w-10 h-10 rounded-md bg-[#181B21] hover:bg-[#232730] text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full max-w-5xl rounded-lg overflow-hidden border border-[#272B36]">
            <BikeImage
              src={displayImage}
              alt={`${motorcycle.name} - ${activeColor ? activeColor.name : ''}`}
              aspectClassName="aspect-[4/3]"
              tintHex={activeColor?.hex}
              tintName={activeColor?.name}
              applyColorGrade={!hasDedicatedColorImage && selectedColorIndex > 0}
              priority
            />
          </div>

          {motorcycle.colors.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {motorcycle.colors.map((color, idx) => {
                const selected = idx === selectedColorIndex;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#D91B24] border-[#D91B24] text-white'
                        : 'bg-[#131519] border-[#2A2E39] text-[#E2E4E9] hover:border-white/50'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
