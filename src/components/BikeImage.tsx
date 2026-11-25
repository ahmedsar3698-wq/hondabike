import { useState, useEffect, CSSProperties } from 'react';
import { Bike } from 'lucide-react';

interface BikeImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
  tintHex?: string;
  tintName?: string;
  applyColorGrade?: boolean;
}

function getStudioColorStyle(tintName?: string, tintHex?: string, applyGrade?: boolean): {
  imgStyle?: CSSProperties;
  overlayColor?: string;
} {
  if (!applyGrade || !tintName) return {};
  const lower = tintName.toLowerCase();

  if (lower.includes('black') || lower.includes('graphite')) {
    return {
      imgStyle: { filter: 'grayscale(0.75) contrast(1.12) brightness(0.86)' },
      overlayColor: 'rgba(15, 17, 22, 0.25)',
    };
  }
  if (lower.includes('silver') || lower.includes('grey') || lower.includes('gray')) {
    return {
      imgStyle: { filter: 'grayscale(0.95) contrast(1.06) brightness(1.04)' },
      overlayColor: 'rgba(156, 163, 175, 0.14)',
    };
  }
  if (lower.includes('white')) {
    return {
      imgStyle: { filter: 'grayscale(0.85) contrast(1.05) brightness(1.12)' },
      overlayColor: 'rgba(243, 244, 246, 0.12)',
    };
  }
  if (lower.includes('blue')) {
    return {
      imgStyle: { filter: 'hue-rotate(210deg) saturate(1.25) contrast(1.04)' },
      overlayColor: 'rgba(29, 78, 216, 0.16)',
    };
  }
  if (lower.includes('green')) {
    return {
      imgStyle: { filter: 'hue-rotate(120deg) saturate(1.1) contrast(1.04)' },
      overlayColor: 'rgba(20, 83, 45, 0.18)',
    };
  }
  if (lower.includes('gold') || lower.includes('yellow')) {
    return {
      imgStyle: { filter: 'hue-rotate(38deg) saturate(1.35) brightness(1.02)' },
      overlayColor: 'rgba(212, 175, 55, 0.16)',
    };
  }
  if (lower.includes('red')) {
    return {
      imgStyle: { filter: 'saturate(1.15) contrast(1.03)' },
      overlayColor: 'rgba(200, 16, 46, 0.14)',
    };
  }

  return tintHex
    ? {
        imgStyle: { filter: 'saturate(0.95) contrast(1.04)' },
        overlayColor: `${tintHex}28`,
      }
    : {};
}

export function BikeImage({
  src,
  alt,
  className = '',
  aspectClassName = 'aspect-[4/3]',
  priority = false,
  tintHex,
  tintName,
  applyColorGrade = false,
}: BikeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setLoaded(false);
  }, [src]);

  const { imgStyle, overlayColor } = getStudioColorStyle(tintName, tintHex, applyColorGrade);

  if (!src || hasError) {
    return (
      <div
        className={`${aspectClassName} w-full bg-gradient-to-br from-[#16181D] via-[#121317] to-[#0B0C0E] flex flex-col items-center justify-center p-6 text-center border-b border-[#22252C] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-[#1D2027] flex items-center justify-center mb-3 text-[#D91B24]">
          <Bike className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-medium text-[#E2E4E9] max-w-[22ch] truncate">{alt}</p>
        <p className="text-xs text-[#8A909E] mt-1">Showroom Studio Image</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#141518] ${aspectClassName} w-full ${className}`}>
      {!loaded && (
        <div
          className="absolute inset-0 bg-[#16181D] animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        style={imgStyle}
        className={`w-full h-full object-cover transition-all duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {overlayColor && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color transition-colors duration-300"
          style={{ backgroundColor: overlayColor }}
          aria-hidden="true"
        />
      )}
      {tintHex && (
        <div
          className="absolute inset-x-0 bottom-0 h-1 pointer-events-none opacity-80 transition-colors duration-300"
          style={{ backgroundColor: tintHex }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
