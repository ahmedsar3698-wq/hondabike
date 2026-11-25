import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  RotateCcw,
  Search,
  Check,
  X,
  Eye,
  LogOut,
} from 'lucide-react';
import { AppRoute, Motorcycle, ContactInquiry } from '../types/motorcycle';
import { formatPKR, formatDisplayDate } from '../utils/formatters';
import { StorageResult } from '../hooks/useMotorcycles';
import { BikeImage } from '../components/BikeImage';
import { AdminBikeFormModal } from '../components/AdminBikeFormModal';
import { AdminLoginGate, ADMIN_SESSION_STORAGE_KEY } from '../components/AdminLoginGate';

interface AdminPageProps {
  motorcycles: Motorcycle[];
  inquiries: ContactInquiry[];
  latestPriceUpdateDate: string;
  storageError: string | null;
  onClearError: () => void;
  onAddMotorcycle: (input: Omit<Motorcycle, 'id' | 'slug'>) => StorageResult;
  onUpdateMotorcycle: (id: string, updates: Partial<Motorcycle>) => StorageResult;
  onUpdatePrice: (id: string, pricePKR: number | null, priceConfirmed: boolean) => StorageResult;
  onToggleFeatured: (id: string) => StorageResult;
  onDeleteMotorcycle: (id: string) => StorageResult;
  onResetDefaults: () => StorageResult;
  onDeleteInquiry: (id: string) => void;
  onNavigate: (route: AppRoute) => void;
}

export function AdminPage({
  motorcycles,
  inquiries,
  latestPriceUpdateDate,
  storageError,
  onClearError,
  onAddMotorcycle,
  onUpdateMotorcycle,
  onUpdatePrice,
  onToggleFeatured,
  onDeleteMotorcycle,
  onResetDefaults,
  onDeleteInquiry,
  onNavigate,
}: AdminPageProps) {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'inquiries'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Motorcycle | null>(null);

  // Inline quick price editing state
  const [priceEditId, setPriceEditId] = useState<string | null>(null);
  const [priceEditValue, setPriceEditValue] = useState('');
  const [priceEditConfirmed, setPriceEditConfirmed] = useState(true);

  // Confirmation modals
  const [deleteConfirmBike, setDeleteConfirmBike] = useState<Motorcycle | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Status banner
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedSession = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession) as { email?: string };
        if (parsed?.email) {
          setAdminEmail(parsed.email);
        }
      }
    } catch {
      setAdminEmail(null);
    }
  }, []);

  const handleSignOut = () => {
    try {
      window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setAdminEmail(null);
  };

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const filteredBikes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return motorcycles;
    return motorcycles.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.series.toLowerCase().includes(q) ||
        m.engineLabel.toLowerCase().includes(q)
    );
  }, [motorcycles, searchQuery]);

  const featuredCount = motorcycles.filter((m) => m.isFeatured).length;
  const confirmedCount = motorcycles.filter((m) => m.priceConfirmed && m.pricePKR).length;
  const unconfirmedCount = motorcycles.length - confirmedCount;

  const startInlinePriceEdit = (bike: Motorcycle) => {
    setPriceEditId(bike.id);
    setPriceEditConfirmed(bike.priceConfirmed);
    setPriceEditValue(bike.pricePKR !== null ? String(bike.pricePKR) : '');
  };

  const saveInlinePriceEdit = (id: string) => {
    const numeric = Number(priceEditValue.replace(/,/g, '').trim());
    if (priceEditConfirmed && (!priceEditValue.trim() || Number.isNaN(numeric) || numeric <= 0)) {
      return;
    }
    const res = onUpdatePrice(id, priceEditConfirmed ? Math.round(numeric) : null, priceEditConfirmed);
    if (res.ok) {
      setPriceEditId(null);
      notify('Official PKR price updated and saved.');
    }
  };

  const handleSaveModal = (data: Omit<Motorcycle, 'id' | 'slug'>, existingId?: string) => {
    if (existingId) {
      const res = onUpdateMotorcycle(existingId, data);
      if (res.ok) notify(`${data.name} updated successfully.`);
      return res;
    } else {
      const res = onAddMotorcycle(data);
      if (res.ok) notify(`${data.name} added to showroom catalog.`);
      return res;
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmBike) return;
    const targetName = deleteConfirmBike.name;
    const res = onDeleteMotorcycle(deleteConfirmBike.id);
    setDeleteConfirmBike(null);
    if (res.ok) notify(`${targetName} removed from catalog.`);
  };

  const handleConfirmReset = () => {
    const res = onResetDefaults();
    setShowResetConfirm(false);
    if (res.ok) notify('Catalog restored to official Atlas Honda Pakistan defaults.');
  };

  if (!adminEmail) {
    return <AdminLoginGate onSuccess={(email) => setAdminEmail(email)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1E212A]">
        <div>
          <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
            Showroom Management Console · Signed in as {adminEmail}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white tracking-tight">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-[#949BA8]">
            Manage Honda motorcycle listings, official Atlas Honda PKR prices, specifications, colors,
            and featured showroom placements. All changes persist in LocalStorage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#C7CCD6] bg-[#15181E] hover:bg-[#1D212A] border border-[#282D38] rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#C7CCD6] bg-[#15181E] hover:bg-[#1D212A] border border-[#282D38] rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingBike(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Motorcycle</span>
          </button>
        </div>
      </div>

      {/* Feedback / Storage Error Banners */}
      {storageError && (
        <div
          role="alert"
          className="p-4 bg-[#2A1418] border border-[#D91B24]/60 rounded-md flex items-center justify-between gap-4 text-sm text-[#FCA5A5]"
        >
          <span>{storageError}</span>
          <button
            type="button"
            onClick={onClearError}
            aria-label="Dismiss error"
            className="text-[#FCA5A5] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {statusMessage && (
        <div
          role="status"
          className="p-3.5 bg-[#12261B] border border-[#10B981]/40 rounded-md text-xs sm:text-sm text-[#6EE7B7] flex items-center justify-between gap-4"
        >
          <span>{statusMessage}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            aria-label="Dismiss notification"
            className="text-[#6EE7B7] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#131519] border border-[#222630] rounded-lg">
          <p className="text-xs text-[#8A909E]">Total Models</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-white tabular-nums">
            {motorcycles.length}
          </p>
        </div>
        <div className="p-5 bg-[#131519] border border-[#222630] rounded-lg">
          <p className="text-xs text-[#8A909E]">Featured on Home</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-white tabular-nums">
            {featuredCount}
          </p>
        </div>
        <div className="p-5 bg-[#131519] border border-[#222630] rounded-lg">
          <p className="text-xs text-[#8A909E]">Confirmed PKR Prices</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-white tabular-nums">
            {confirmedCount}
            {unconfirmedCount > 0 && (
              <span className="ml-2 text-xs font-normal text-[#F59E0B]">
                ({unconfirmedCount} unconfirmed)
              </span>
            )}
          </p>
        </div>
        <div className="p-5 bg-[#131519] border border-[#222630] rounded-lg">
          <p className="text-xs text-[#8A909E]">Last Price Update</p>
          <p className="mt-1.5 font-mono text-base sm:text-lg font-semibold text-white tabular-nums">
            {formatDisplayDate(latestPriceUpdateDate)}
          </p>
        </div>
      </div>

      {/* Tab Navigation & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 p-1 bg-[#131519] border border-[#222630] rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#D91B24] text-white'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Motorcycle Inventory ({motorcycles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#D91B24] text-white'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            Customer Inquiries ({inquiries.length})
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8A909E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter inventory..."
              className="w-full h-10 pl-9 pr-3 bg-[#131519] border border-[#252933] rounded-md text-xs sm:text-sm text-white placeholder-[#6E7685] focus:outline-none focus:border-[#D91B24]"
            />
          </div>
        )}
      </div>

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="bg-[#131519] border border-[#222630] rounded-lg overflow-hidden">
          {filteredBikes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-[#949BA8]">No motorcycles found matching your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#222630] text-xs font-semibold uppercase tracking-wider text-[#8A909E]">
                    <th className="py-3.5 px-4">Motorcycle</th>
                    <th className="py-3.5 px-4">Engine</th>
                    <th className="py-3.5 px-4">Official Price (PKR)</th>
                    <th className="py-3.5 px-4">Colors</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2028] text-sm">
                  {filteredBikes.map((bike) => {
                    const isEditingPrice = priceEditId === bike.id;

                    return (
                      <tr key={bike.id} className="hover:bg-[#171A20] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3.5 min-w-[220px]">
                            <div className="w-16 h-12 rounded overflow-hidden shrink-0 border border-[#252933]">
                              <BikeImage
                                src={bike.image}
                                alt={bike.name}
                                aspectClassName="aspect-[4/3]"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{bike.name}</p>
                              <p className="text-xs text-[#8A909E]">
                                {bike.series} · Updated {formatDisplayDate(bike.lastUpdated)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs text-[#C7CCD6] tabular-nums whitespace-nowrap">
                          {bike.engineLabel}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isEditingPrice ? (
                            <div className="flex flex-col gap-2 min-w-[210px]">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  disabled={!priceEditConfirmed}
                                  value={priceEditConfirmed ? priceEditValue : ''}
                                  onChange={(e) => setPriceEditValue(e.target.value)}
                                  placeholder="PKR Price"
                                  className="w-28 h-8 px-2 bg-[#0E1014] border border-[#D91B24] rounded text-xs font-mono text-white tabular-nums focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => saveInlinePriceEdit(bike.id)}
                                  aria-label="Save price"
                                  className="w-8 h-8 rounded bg-[#D91B24] hover:bg-[#B8141C] text-white flex items-center justify-center cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPriceEditId(null)}
                                  aria-label="Cancel price edit"
                                  className="w-8 h-8 rounded bg-[#1E222B] hover:bg-[#282D39] text-[#C7CCD6] flex items-center justify-center cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <label className="inline-flex items-center gap-1.5 text-[11px] text-[#949BA8] cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!priceEditConfirmed}
                                  onChange={(e) => setPriceEditConfirmed(!e.target.checked)}
                                  className="accent-[#D91B24]"
                                />
                                <span>Mark as Price Not Confirmed</span>
                              </label>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startInlinePriceEdit(bike)}
                              title="Click to edit price quickly"
                              className={`group inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold tabular-nums cursor-pointer hover:underline ${
                                bike.priceConfirmed && bike.pricePKR
                                  ? 'text-white'
                                  : 'text-[#F59E0B]'
                              }`}
                            >
                              <span>{formatPKR(bike.pricePKR, bike.priceConfirmed)}</span>
                              <Pencil className="w-3 h-3 text-[#6E7685] group-hover:text-white" />
                            </button>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {bike.colors.map((c) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() =>
                                  onNavigate({ page: 'details', id: bike.id, color: c.name })
                                }
                                title={`Open ${bike.name} in ${c.name}`}
                                aria-label={`Open ${bike.name} in ${c.name}`}
                                className="w-4 h-4 rounded-full border border-white/30 hover:scale-125 transition-transform cursor-pointer"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              onToggleFeatured(bike.id);
                              notify(
                                `${bike.name} ${
                                  bike.isFeatured ? 'removed from' : 'added to'
                                } featured showcase.`
                              );
                            }}
                            aria-label={`Toggle featured for ${bike.name}`}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                              bike.isFeatured
                                ? 'bg-[#2A1418] border-[#D91B24]/60 text-white'
                                : 'bg-[#101216] border-[#252933] text-[#8A909E] hover:text-white'
                            }`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                bike.isFeatured ? 'fill-[#D91B24] text-[#D91B24]' : ''
                              }`}
                            />
                            <span>{bike.isFeatured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onNavigate({ page: 'details', id: bike.id })}
                              title="View public page"
                              aria-label={`View ${bike.name}`}
                              className="w-8 h-8 rounded bg-[#181B21] hover:bg-[#222630] text-[#C7CCD6] hover:text-white inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBike(bike);
                                setIsModalOpen(true);
                              }}
                              title="Edit motorcycle details"
                              aria-label={`Edit ${bike.name}`}
                              className="w-8 h-8 rounded bg-[#181B21] hover:bg-[#222630] text-[#C7CCD6] hover:text-white inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmBike(bike)}
                              title="Delete motorcycle"
                              aria-label={`Delete ${bike.name}`}
                              className="w-8 h-8 rounded bg-[#181B21] hover:bg-[#2A1418] text-[#C7CCD6] hover:text-[#F87171] inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div className="bg-[#131519] border border-[#222630] rounded-lg overflow-hidden">
          {inquiries.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <p className="text-sm font-medium text-white">No Customer Inquiries Yet</p>
              <p className="text-xs text-[#949BA8]">
                Messages submitted through the Contact Us page will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1E212A]">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A909E]">
                      <span className="font-mono text-[#D91B24] font-semibold">{inq.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{inq.motorcycleName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{inq.city}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{formatDisplayDate(inq.submittedAt)}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {inq.fullName}{' '}
                      <span className="font-mono font-normal text-xs text-[#949BA8] ml-2 tabular-nums">
                        {inq.phone} · {inq.email}
                      </span>
                    </p>
                    <p className="text-sm text-[#C7CCD6] leading-relaxed">{inq.message}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteInquiry(inq.id)}
                    className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#949BA8] hover:text-[#F87171] bg-[#181B21] border border-[#252933] rounded-md cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Motorcycle Modal */}
      <AdminBikeFormModal
        isOpen={isModalOpen}
        editingBike={editingBike}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmBike && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#131519] border border-[#272B36] rounded-lg p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-white">Delete Motorcycle</h2>
            <p className="text-sm text-[#C7CCD6]">
              Are you sure you want to remove{' '}
              <span className="font-semibold text-white">{deleteConfirmBike.name}</span> from the
              showroom catalog? This action updates browser LocalStorage immediately.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmBike(null)}
                className="px-4 py-2 text-xs font-medium text-[#C7CCD6] bg-[#181B21] hover:bg-[#21252D] border border-[#2A2E39] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md cursor-pointer"
              >
                Delete Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Defaults Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#131519] border border-[#272B36] rounded-lg p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-white">
              Restore Official Atlas Honda Defaults
            </h2>
            <p className="text-sm text-[#C7CCD6]">
              This will restore the catalog to the verified default Atlas Honda Pakistan models and
              official PKR prices. Custom edits or added bikes will be replaced.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-[#C7CCD6] bg-[#181B21] hover:bg-[#21252D] border border-[#2A2E39] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md cursor-pointer"
              >
                Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
