import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Motorcycle, BikeColor, BikeSpecification } from '../types/motorcycle';
import { STUDIO_IMAGE_PRESETS } from '../data/motorcycles';
import { compressImageFileToDataUrl } from '../utils/formatters';
import { BikeImage } from './BikeImage';

interface AdminBikeFormModalProps {
  isOpen: boolean;
  editingBike: Motorcycle | null;
  onClose: () => void;
  onSave: (
    data: Omit<Motorcycle, 'id' | 'slug'>,
    existingId?: string
  ) => { ok: boolean; error?: string };
}

const DEFAULT_SPECS: BikeSpecification[] = [
  { label: 'Engine Type', value: '4-Stroke OHC Air-Cooled Single Cylinder' },
  { label: 'Displacement', value: '124 cc' },
  { label: 'Transmission', value: '4-Speed Constant Mesh' },
  { label: 'Starting System', value: 'Kick Start' },
  { label: 'Petrol Capacity', value: '9.2 Liters' },
  { label: 'Dry Weight', value: '100 kg' },
];

export function AdminBikeFormModal({
  isOpen,
  editingBike,
  onClose,
  onSave,
}: AdminBikeFormModalProps) {
  const [name, setName] = useState('');
  const [series, setSeries] = useState('Commuter Series');
  const [engineCC, setEngineCC] = useState('124');
  const [engineLabel, setEngineLabel] = useState('125 CC');
  const [priceConfirmed, setPriceConfirmed] = useState(true);
  const [pricePKR, setPricePKR] = useState('');
  const [priceNote, setPriceNote] = useState('Official Atlas Honda ex-factory price');
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState(STUDIO_IMAGE_PRESETS[0].url);
  const [transmission, setTransmission] = useState('4-Speed Constant Mesh');
  const [startingSystem, setStartingSystem] = useState('Kick Start');
  const [fuelCapacity, setFuelCapacity] = useState('9.2 Liters');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [highlightsText, setHighlightsText] = useState('');
  const [colors, setColors] = useState<BikeColor[]>([
    { name: 'Red', hex: '#C8102E' },
    { name: 'Black', hex: '#17191D' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#C8102E');
  const [newColorImage, setNewColorImage] = useState('');
  const [specifications, setSpecifications] = useState<BikeSpecification[]>(DEFAULT_SPECS);
  const [isFeatured, setIsFeatured] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormError(null);

    if (editingBike) {
      setName(editingBike.name);
      setSeries(editingBike.series);
      setEngineCC(String(editingBike.engineCC));
      setEngineLabel(editingBike.engineLabel);
      setPriceConfirmed(editingBike.priceConfirmed);
      setPricePKR(editingBike.pricePKR !== null ? String(editingBike.pricePKR) : '');
      setPriceNote(editingBike.priceNote || '');
      setLastUpdated(editingBike.lastUpdated || new Date().toISOString().split('T')[0]);
      setImage(editingBike.image);
      setTransmission(editingBike.transmission);
      setStartingSystem(editingBike.startingSystem);
      setFuelCapacity(editingBike.fuelCapacity);
      setShortDescription(editingBike.shortDescription);
      setFullDescription(editingBike.fullDescription);
      setHighlightsText(editingBike.highlights.join('\n'));
      setColors(editingBike.colors.length > 0 ? editingBike.colors : [{ name: 'Red', hex: '#C8102E' }]);
      setSpecifications(
        editingBike.specifications.length > 0 ? editingBike.specifications : DEFAULT_SPECS
      );
      setIsFeatured(editingBike.isFeatured);
    } else {
      setName('');
      setSeries('Commuter Series');
      setEngineCC('124');
      setEngineLabel('125 CC');
      setPriceConfirmed(true);
      setPricePKR('');
      setPriceNote('Official Atlas Honda ex-factory price');
      setLastUpdated(new Date().toISOString().split('T')[0]);
      setImage(STUDIO_IMAGE_PRESETS[3].url);
      setTransmission('4-Speed Constant Mesh');
      setStartingSystem('Kick Start');
      setFuelCapacity('9.2 Liters');
      setShortDescription('');
      setFullDescription('');
      setHighlightsText(
        '4-Stroke air-cooled Honda powerplant\nAuthorized Atlas Honda warranty & spare parts support'
      );
      setColors([
        { name: 'Red', hex: '#C8102E' },
        { name: 'Black', hex: '#17191D' },
      ]);
      setSpecifications(DEFAULT_SPECS);
      setIsFeatured(false);
    }
  }, [isOpen, editingBike]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError(null);
    setIsUploadingImage(true);
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      setImage(dataUrl);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddColor = () => {
    const trimmed = newColorName.trim();
    if (!trimmed) return;
    if (colors.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) return;
    setColors([
      ...colors,
      {
        name: trimmed,
        hex: newColorHex,
        ...(newColorImage.trim() ? { image: newColorImage.trim() } : {}),
      },
    ]);
    setNewColorName('');
    setNewColorImage('');
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    setSpecifications((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleAddSpecRow = () => {
    setSpecifications([...specifications, { label: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Model name is required.');
      return;
    }

    const parsedCC = Number(engineCC);
    if (Number.isNaN(parsedCC) || parsedCC < 0) {
      setFormError('Engine CC must be 0 (for Electric) or a positive number.');
      return;
    }

    let parsedPrice: number | null = null;
    if (priceConfirmed) {
      const numericPrice = Number(pricePKR.replace(/,/g, '').trim());
      if (!pricePKR.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
        setFormError(
          'Enter a valid official PKR price or uncheck "Official Price Confirmed" to display "Price Not Confirmed".'
        );
        return;
      }
      parsedPrice = Math.round(numericPrice);
    }

    if (!shortDescription.trim()) {
      setFormError('Short description is required.');
      return;
    }

    const cleanedSpecs = specifications.filter((s) => s.label.trim() && s.value.trim());
    const cleanedHighlights = highlightsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const payload: Omit<Motorcycle, 'id' | 'slug'> = {
      name: name.trim(),
      series: series.trim() || 'Honda Series',
      engineCC: parsedCC,
      engineLabel: engineLabel.trim() || (parsedCC === 0 ? 'Electric' : `${parsedCC} CC`),
      pricePKR: parsedPrice,
      priceConfirmed,
      priceNote: priceNote.trim() || undefined,
      lastUpdated: lastUpdated || new Date().toISOString().split('T')[0],
      image: image.trim() || STUDIO_IMAGE_PRESETS[0].url,
      colors: colors.length > 0 ? colors : [{ name: 'Red', hex: '#C8102E' }],
      transmission: transmission.trim() || '4-Speed Constant Mesh',
      startingSystem: startingSystem.trim() || 'Kick Start',
      fuelCapacity: fuelCapacity.trim() || '9.0 Liters',
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim() || shortDescription.trim(),
      highlights: cleanedHighlights,
      specifications: cleanedSpecs,
      isFeatured,
    };

    const result = onSave(payload, editingBike?.id);
    if (!result.ok) {
      setFormError(result.error || 'Could not save motorcycle.');
      return;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div className="w-full max-w-4xl bg-[#131519] border border-[#272B36] rounded-lg shadow-2xl my-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#222630] flex items-center justify-between gap-4 shrink-0">
          <h2 id="admin-modal-title" className="font-display text-xl font-bold text-white">
            {editingBike ? `Edit ${editingBike.name}` : 'Add New Honda Motorcycle'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-md flex items-center justify-center text-[#949BA8] hover:text-white hover:bg-[#1D2028] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {formError && (
            <div
              role="alert"
              className="p-3.5 bg-[#2A1418] border border-[#D91B24]/60 rounded-md text-xs sm:text-sm text-[#FCA5A5]"
            >
              {formError}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Model Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Honda CG 125"
                className="w-full h-10 px-3 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Series / Category
              </label>
              <input
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder="Commuter Series"
                className="w-full h-10 px-3 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Engine CC (0 = Electric)
              </label>
              <input
                type="number"
                min={0}
                value={engineCC}
                onChange={(e) => setEngineCC(e.target.value)}
                className="w-full h-10 px-3 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#D91B24]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Engine Badge Label
              </label>
              <input
                type="text"
                value={engineLabel}
                onChange={(e) => setEngineLabel(e.target.value)}
                placeholder="125 CC"
                className="w-full h-10 px-3 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Transmission
              </label>
              <input
                type="text"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full h-10 px-3 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Starting System
              </label>
              <input
                type="text"
                value={startingSystem}
                onChange={(e) => setStartingSystem(e.target.value)}
                className="w-full h-10 px-3 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24]"
              />
            </div>
          </div>

          {/* Official Pricing */}
          <div className="p-4 bg-[#0E1014] border border-[#232732] rounded-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={priceConfirmed}
                  onChange={(e) => setPriceConfirmed(e.target.checked)}
                  className="w-4 h-4 accent-[#D91B24] rounded cursor-pointer"
                />
                <span>Official Atlas Honda Price Confirmed</span>
              </label>

              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#D91B24] rounded cursor-pointer"
                />
                <span>Feature on Home Page</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                  Official Price (PKR)
                </label>
                <input
                  type="number"
                  min={0}
                  disabled={!priceConfirmed}
                  value={priceConfirmed ? pricePKR : ''}
                  onChange={(e) => setPricePKR(e.target.value)}
                  placeholder={priceConfirmed ? '238500' : 'Price Not Confirmed'}
                  className="w-full h-10 px-3 bg-[#131519] border border-[#262A34] disabled:opacity-50 rounded-md text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                  Last Price Update Date
                </label>
                <input
                  type="date"
                  value={lastUpdated}
                  onChange={(e) => setLastUpdated(e.target.value)}
                  className="w-full h-10 px-3 bg-[#131519] border border-[#262A34] rounded-md text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                  Price Note
                </label>
                <input
                  type="text"
                  value={priceNote}
                  onChange={(e) => setPriceNote(e.target.value)}
                  placeholder="Official Atlas Honda ex-factory price"
                  className="w-full h-10 px-3 bg-[#131519] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>
            </div>
          </div>

          {/* Image Upload / Preset / URL */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start p-4 bg-[#0E1014] border border-[#232732] rounded-md">
            <div className="md:col-span-4">
              <div className="rounded-md overflow-hidden border border-[#252933]">
                <BikeImage src={image} alt={name || 'Preview'} aspectClassName="aspect-[4/3]" />
              </div>
            </div>

            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                  Upload Motorcycle Image (Saved in LocalStorage)
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1B1F27] hover:bg-[#242934] border border-[#323745] rounded-md transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-[#D91B24]" />
                  <span>{isUploadingImage ? 'Optimizing Image...' : 'Choose Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                    Or Select Showroom Studio Preset
                  </label>
                  <select
                    value={STUDIO_IMAGE_PRESETS.some((p) => p.url === image) ? image : ''}
                    onChange={(e) => {
                      if (e.target.value) setImage(e.target.value);
                    }}
                    className="w-full h-10 px-3 bg-[#131519] border border-[#262A34] rounded-md text-xs text-white focus:outline-none focus:border-[#D91B24] cursor-pointer"
                  >
                    <option value="">Custom Uploaded / URL</option>
                    {STUDIO_IMAGE_PRESETS.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                    Image Path or URL
                  </label>
                  <input
                    type="text"
                    value={image.startsWith('data:') ? '(Uploaded Local Image)' : image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/src/assets/images/..."
                    className="w-full h-10 px-3 bg-[#131519] border border-[#262A34] rounded-md text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Short Description (Card Summary)
              </label>
              <textarea
                rows={2}
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Concise summary for showroom cards..."
                className="w-full p-3 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Detailed Description (Bike Details Page)
              </label>
              <textarea
                rows={3}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Complete description of engineering, ride comfort, and features..."
                className="w-full p-3 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                Key Highlights (One per line)
              </label>
              <textarea
                rows={3}
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                className="w-full p-3 bg-[#0E1014] border border-[#262A34] rounded-md text-xs text-white focus:outline-none focus:border-[#D91B24]"
              />
            </div>
          </div>

          {/* Colors Manager */}
          <div className="p-4 bg-[#0E1014] border border-[#232732] rounded-md space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C7CCD6]">
              Available Colors
            </h3>

            <div className="flex flex-wrap gap-2">
              {colors.map((color, idx) => (
                <div
                  key={`${color.name}-${idx}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#161920] border border-[#272C38] rounded-md text-xs text-white"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    aria-label={`Remove ${color.name}`}
                    className="text-[#8A909E] hover:text-[#F87171] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Color name (e.g. Metallic Blue)"
                className="h-9 px-3 bg-[#131519] border border-[#262A34] rounded-md text-xs text-white focus:outline-none focus:border-[#D91B24]"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                aria-label="Color swatch"
                className="h-9 w-12 bg-[#131519] border border-[#262A34] rounded-md p-1 cursor-pointer"
              />
              <select
                value={newColorImage}
                onChange={(e) => setNewColorImage(e.target.value)}
                aria-label="Optional color image preset"
                className="h-9 px-2.5 bg-[#131519] border border-[#262A34] rounded-md text-xs text-white focus:outline-none focus:border-[#D91B24] cursor-pointer"
              >
                <option value="">Auto Studio Tint (Optional Photo)</option>
                {STUDIO_IMAGE_PRESETS.map((preset) => (
                  <option key={preset.url} value={preset.url}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddColor}
                className="inline-flex items-center gap-1 h-9 px-3 text-xs font-medium text-white bg-[#1D212A] hover:bg-[#272C37] border border-[#323846] rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Color</span>
              </button>
            </div>
          </div>

          {/* Specifications Editor */}
          <div className="p-4 bg-[#0E1014] border border-[#232732] rounded-md space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C7CCD6]">
                Technical Specifications
              </h3>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#1D212A] hover:bg-[#272C37] border border-[#323846] rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specifications.map((spec, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. Bore & Stroke)"
                    className="col-span-5 h-9 px-2.5 bg-[#131519] border border-[#262A34] rounded-md text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. 56.5 x 49.5 mm)"
                    className="col-span-6 h-9 px-2.5 bg-[#131519] border border-[#262A34] rounded-md text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecRow(idx)}
                    aria-label="Remove specification row"
                    className="col-span-1 h-9 flex items-center justify-center text-[#8A909E] hover:text-[#F87171] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#222630] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-medium text-[#C7CCD6] bg-[#181B21] hover:bg-[#21252D] border border-[#2B303C] rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
            >
              {editingBike ? 'Save Changes' : 'Add Motorcycle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
