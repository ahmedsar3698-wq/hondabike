import { ArrowRight, Factory, Award, MapPin } from 'lucide-react';
import { AppRoute, Motorcycle } from '../types/motorcycle';
import { formatPKR, formatDisplayDate } from '../utils/formatters';

interface AboutPageProps {
  motorcycles: Motorcycle[];
  latestPriceUpdateDate: string;
  onNavigate: (route: AppRoute) => void;
}

export function AboutPage({
  motorcycles,
  latestPriceUpdateDate,
  onNavigate,
}: AboutPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header & Atlas Honda Story */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-[#1E212A]">
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
            About HONDA BIKE &amp; Atlas Honda Pakistan
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight [text-wrap:balance]">
            Decades of Precision Two-Wheeler Engineering in Pakistan
          </h1>
          <p className="mt-5 text-base text-[#C7CCD6] leading-relaxed">
            Atlas Honda Limited is a historic joint venture between the Atlas Group and Honda Motor
            Co., Ltd. Japan, shaping Pakistan’s mobility landscape since 1962. Operating modern
            manufacturing facilities in Karachi and Sheikhupura, Atlas Honda produces high-efficiency
            4-stroke motorcycles engineered specifically for local road conditions, fuel economy, and
            multi-year reliability.
          </p>
          <p className="mt-4 text-base text-[#9CA3AF] leading-relaxed">
            HONDA BIKE serves as a dedicated digital showroom for riders across Pakistan—bringing
            together verified ex-factory PKR prices, comprehensive technical specification sheets, and
            a responsive dealership inquiry channel for every model from the commuter CD 70 to the
            touring CB 150F and electric ICON e:.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'collection' })}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
            >
              <span>Explore Full Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'contact' })}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#E2E4E9] bg-[#16181D] hover:bg-[#1E2128] border border-[#2B2F3A] rounded-md transition-colors cursor-pointer"
            >
              <span>Contact Showroom</span>
            </button>
          </div>
        </div>

        {/* Key Pillars */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#131519] border border-[#222630] rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[#1B1F27] flex items-center justify-center text-[#D91B24] shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  Karachi &amp; Sheikhupura Plants
                </h2>
                <p className="mt-1 text-sm text-[#949BA8] leading-relaxed">
                  High localization and Japanese quality-control standards delivering consistent engine
                  tolerances across every assembly line.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#131519] border border-[#222630] rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[#1B1F27] flex items-center justify-center text-[#D91B24] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  Unmatched Resale &amp; Parts Ecosystem
                </h2>
                <p className="mt-1 text-sm text-[#949BA8] leading-relaxed">
                  Genuine Honda parts and trained mechanics are accessible across metropolitan centers
                  and rural towns throughout Pakistan.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#131519] border border-[#222630] rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[#1B1F27] flex items-center justify-center text-[#D91B24] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  From 70cc Commuters to Electric Mobility
                </h2>
                <p className="mt-1 text-sm text-[#949BA8] leading-relaxed">
                  A complete spectrum spanning CD 70, Pridor, CG 125, CB 125F, CG 150, CB 150F, and the
                  zero-emission ICON e:.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Official Atlas Honda Price Table */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#1E212A]">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
              Verified Rate Card
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white tracking-tight">
              Official Atlas Honda Pakistan Price List
            </h2>
          </div>
          <p className="text-xs text-[#8A909E] tabular-nums">
            Latest Price Update: {formatDisplayDate(latestPriceUpdateDate)}
          </p>
        </div>

        <div className="mt-6 overflow-x-auto bg-[#131519] border border-[#222630] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222630] text-xs font-semibold uppercase tracking-wider text-[#8A909E]">
                <th className="py-3.5 px-5">Model</th>
                <th className="py-3.5 px-5">Engine</th>
                <th className="py-3.5 px-5">Transmission</th>
                <th className="py-3.5 px-5">Official Price (PKR)</th>
                <th className="py-3.5 px-5">Updated</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2028] text-sm">
              {motorcycles.map((bike) => (
                <tr key={bike.id} className="hover:bg-[#171A20] transition-colors">
                  <td className="py-4 px-5 font-medium text-white whitespace-nowrap">{bike.name}</td>
                  <td className="py-4 px-5 font-mono text-xs text-[#C7CCD6] tabular-nums whitespace-nowrap">
                    {bike.engineLabel}
                  </td>
                  <td className="py-4 px-5 text-[#949BA8] whitespace-nowrap">
                    {bike.transmission}
                  </td>
                  <td
                    className={`py-4 px-5 font-mono font-semibold tabular-nums whitespace-nowrap ${
                      bike.priceConfirmed && bike.pricePKR ? 'text-white' : 'text-[#F59E0B]'
                    }`}
                  >
                    {formatPKR(bike.pricePKR, bike.priceConfirmed)}
                  </td>
                  <td className="py-4 px-5 text-xs text-[#8A909E] tabular-nums whitespace-nowrap">
                    {formatDisplayDate(bike.lastUpdated)}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onNavigate({ page: 'details', id: bike.id })}
                      className="text-xs font-semibold text-[#D91B24] hover:text-white transition-colors cursor-pointer"
                    >
                      View Specs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
