import { useState } from 'react';
import { GitCompareArrows, X, ArrowRight } from 'lucide-react';
import { Motorcycle, AppRoute } from '../types/motorcycle';
import { formatPKR } from '../utils/formatters';
import { BikeImage } from './BikeImage';

interface BikeCompareBarProps {
  selectedBikes: Motorcycle[];
  onRemoveBike: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (route: AppRoute) => void;
}

export function BikeCompareBar({
  selectedBikes,
  onRemoveBike,
  onClearAll,
  onNavigate,
}: BikeCompareBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedBikes.length === 0) return null;

  return (
    <>
      {/* Compact Sticky Comparison Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl bg-[#131519]/95 backdrop-blur-md border border-[#2C313D] rounded-lg shadow-2xl px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white mr-1">
              <GitCompareArrows className="w-4 h-4 text-[#D91B24]" />
              <span>Compare ({selectedBikes.length}/3):</span>
            </span>

            {selectedBikes.map((bike) => (
              <span
                key={bike.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1B1F27] border border-[#2B303C] rounded text-xs text-[#E2E4E9]"
              >
                <span className="truncate max-w-[140px]">{bike.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveBike(bike.id)}
                  aria-label={`Remove ${bike.name} from comparison`}
                  className="text-[#8A909E] hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-medium text-[#9CA3AF] hover:text-white cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={selectedBikes.length < 2}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] disabled:opacity-50 rounded-md transition-colors cursor-pointer"
            >
              <span>{selectedBikes.length < 2 ? 'Select 1 More' : 'Compare Side-by-Side'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Side-by-Side Comparison Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-modal-title"
        >
          <div className="w-full max-w-5xl bg-[#131519] border border-[#272B36] rounded-lg shadow-2xl my-8 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#222630] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
                  Showroom Comparison
                </p>
                <h2 id="compare-modal-title" className="font-display text-xl font-bold text-white">
                  Side-by-Side Honda Specifications
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close comparison"
                className="w-9 h-9 rounded-md flex items-center justify-center text-[#949BA8] hover:text-white hover:bg-[#1D2028] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto flex-1 p-6">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-[#222630]">
                    <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-[#8A909E] w-44 align-bottom">
                      Specification
                    </th>
                    {selectedBikes.map((bike) => (
                      <th key={bike.id} className="py-3 px-4 align-top">
                        <div className="space-y-3">
                          <div className="rounded overflow-hidden border border-[#242833]">
                            <BikeImage
                              src={bike.image}
                              alt={bike.name}
                              aspectClassName="aspect-[4/3]"
                            />
                          </div>
                          <div>
                            <p className="font-display text-base font-bold text-white">
                              {bike.name}
                            </p>
                            <p className="text-xs text-[#949BA8] font-normal mt-0.5">
                              {bike.series}
                            </p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2028] text-sm">
                  <tr>
                    <td className="py-3.5 pr-4 text-xs font-medium text-[#949BA8]">
                      Official Price (PKR)
                    </td>
                    {selectedBikes.map((bike) => (
                      <td
                        key={bike.id}
                        className={`py-3.5 px-4 font-mono font-bold tabular-nums ${
                          bike.priceConfirmed && bike.pricePKR ? 'text-white' : 'text-[#F59E0B]'
                        }`}
                      >
                        {formatPKR(bike.pricePKR, bike.priceConfirmed)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 text-xs font-medium text-[#949BA8]">
                      Engine Capacity
                    </td>
                    {selectedBikes.map((bike) => (
                      <td
                        key={bike.id}
                        className="py-3.5 px-4 font-mono text-xs text-white tabular-nums"
                      >
                        {bike.engineLabel}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 text-xs font-medium text-[#949BA8]">
                      Transmission
                    </td>
                    {selectedBikes.map((bike) => (
                      <td key={bike.id} className="py-3.5 px-4 text-xs text-[#E2E4E9]">
                        {bike.transmission}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 text-xs font-medium text-[#949BA8]">
                      Starting System
                    </td>
                    {selectedBikes.map((bike) => (
                      <td key={bike.id} className="py-3.5 px-4 text-xs text-[#E2E4E9]">
                        {bike.startingSystem}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 text-xs font-medium text-[#949BA8]">
                      Fuel / Battery
                    </td>
                    {selectedBikes.map((bike) => (
                      <td key={bike.id} className="py-3.5 px-4 text-xs text-[#E2E4E9] tabular-nums">
                        {bike.fuelCapacity}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 text-xs font-medium text-[#949BA8]">
                      Available Colors
                    </td>
                    {selectedBikes.map((bike) => (
                      <td key={bike.id} className="py-3.5 px-4 text-xs text-[#E2E4E9]">
                        <div className="flex flex-wrap items-center gap-2">
                          {bike.colors.map((c) => (
                            <span key={c.name} className="inline-flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 rounded-full border border-white/25"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span>{c.name}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-xs font-medium text-[#949BA8]">Action</td>
                    {selectedBikes.map((bike) => (
                      <td key={bike.id} className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            onNavigate({ page: 'details', id: bike.id });
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
                        >
                          <span>View Full Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
