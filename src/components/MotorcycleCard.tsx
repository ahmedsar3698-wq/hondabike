import { useState } from 'react';
import { ArrowRight, GitCompareArrows, Check } from 'lucide-react';
import { Motorcycle } from '../types/motorcycle';
import { formatPKR, formatDisplayDate } from '../utils/formatters';
import { BikeImage } from './BikeImage';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onViewDetails: (id: string, colorName?: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
}

export function MotorcycleCard({
  motorcycle,
  onViewDetails,
  isCompared = false,
  onToggleCompare,
}: MotorcycleCardProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const activeColor = motorcycle.colors[selectedColorIdx] || motorcycle.colors[0];
  const hasDedicatedColorImage = Boolean(activeColor?.image);
  const displayImage = activeColor?.image || motorcycle.image;
  const priceDisplay = formatPKR(motorcycle.pricePKR, motorcycle.priceConfirmed);

  return (
    <article className="group flex flex-col bg-[#131519] border border-[#22252E] rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3A4050]">
      {/* Studio Image Area */}
      <button
        type="button"
        onClick={() => onViewDetails(motorcycle.id, activeColor?.name)}
        className="relative block w-full text-left overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D91B24]"
        aria-label={`View details for ${motorcycle.name}${activeColor ? ` in ${activeColor.name}` : ''}`}
      >
        <BikeImage
          src={displayImage}
          alt={`${motorcycle.name}${activeColor ? ` - ${activeColor.name}` : ''}`}
          aspectClassName="aspect-[4/3]"
          tintHex={activeColor?.hex}
          tintName={activeColor?.name}
          applyColorGrade={!hasDedicatedColorImage && selectedColorIdx > 0}
          className="group-hover:scale-[1.03] transition-transform duration-300"
        />
      </button>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Clean unboxed typographic metadata */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#949BA8] tracking-wide">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono tabular-nums text-[#E2E4E9] shrink-0">
              {motorcycle.engineLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{motorcycle.startingSystem}</span>
          </div>
          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(motorcycle.id)}
              className={`inline-flex items-center gap-1 text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                isCompared ? 'text-[#D91B24]' : 'text-[#8A909E] hover:text-white'
              }`}
              aria-pressed={isCompared}
              title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
            >
              {isCompared ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <GitCompareArrows className="w-3.5 h-3.5" />
              )}
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>
          )}
        </div>

        {/* Model Name */}
        <h3 className="mt-2 font-display text-xl font-semibold text-white tracking-tight">
          {motorcycle.name}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-sm text-[#A1A7B3] leading-relaxed line-clamp-2 flex-1">
          {motorcycle.shortDescription}
        </p>

        {/* Interactive Available Colors Selector */}
        <div className="mt-4 pt-4 border-t border-[#1E212A] flex items-center justify-between gap-3">
          <span className="text-xs text-[#8A909E] truncate">
            Color:{' '}
            <span className="text-[#E2E4E9] font-medium">
              {activeColor ? activeColor.name : 'Standard'}
            </span>
          </span>
          <div className="flex items-center gap-2 shrink-0" role="group" aria-label="Select motorcycle color">
            {motorcycle.colors.map((color, idx) => {
              const isSelected = idx === selectedColorIdx;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorIdx(idx);
                  }}
                  title={`Show ${color.name}`}
                  aria-label={`Select ${color.name} color`}
                  aria-pressed={isSelected}
                  className={`w-5 h-5 rounded-full transition-transform duration-150 cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#131519] scale-110'
                      : 'border border-white/30 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* Official Price & Action */}
        <div className="mt-4 pt-4 border-t border-[#1E212A] flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#8A909E]">
              Ex-Factory · {formatDisplayDate(motorcycle.lastUpdated)}
            </p>
            <p
              className={`mt-1 text-base sm:text-lg font-semibold tabular-nums font-mono ${
                motorcycle.priceConfirmed && motorcycle.pricePKR ? 'text-white' : 'text-[#F59E0B]'
              }`}
            >
              {priceDisplay}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onViewDetails(motorcycle.id, activeColor?.name)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
