import { useState, useEffect, useCallback, useMemo } from 'react';
import { Motorcycle, ContactInquiry } from '../types/motorcycle';
import { INITIAL_MOTORCYCLES, OFFICIAL_PRICE_REFERENCE_DATE } from '../data/motorcycles';
import { slugifyModelName } from '../utils/formatters';

const CATALOG_STORAGE_KEY = 'honda_bike_pk_catalog_v1';
const CATALOG_SCHEMA_VERSION_KEY = 'honda_bike_pk_catalog_version';
const CURRENT_CATALOG_VERSION = '2026.3';
const INQUIRIES_STORAGE_KEY = 'honda_bike_pk_inquiries_v1';

export interface StorageResult {
  ok: boolean;
  error?: string;
}

export function useMotorcycles() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Hydrate from LocalStorage on mount; non-destructively merge color images & new official models
  useEffect(() => {
    try {
      const savedCatalog = window.localStorage.getItem(CATALOG_STORAGE_KEY);
      const savedVersion = window.localStorage.getItem(CATALOG_SCHEMA_VERSION_KEY);

      if (savedCatalog) {
        const parsed = JSON.parse(savedCatalog) as Motorcycle[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          let merged = parsed;

          if (savedVersion !== CURRENT_CATALOG_VERSION) {
            const existingIds = new Set(parsed.map((item) => item.id));
            const newOfficialModels = INITIAL_MOTORCYCLES.filter(
              (official) => !existingIds.has(official.id)
            );

            merged = [
              ...parsed.map((item) => {
                const match = INITIAL_MOTORCYCLES.find((o) => o.id === item.id);
                if (!match) return item;
                // Merge per-color studio images onto matching colors without discarding user edits
                const mergedColors = item.colors.map((c) => {
                  if (c.image) return c;
                  const officialColor = match.colors.find(
                    (oc) => oc.name.toLowerCase() === c.name.toLowerCase()
                  );
                  return officialColor?.image ? { ...c, image: officialColor.image } : c;
                });
                return {
                  ...item,
                  image: item.id === 'honda-cb-150f-blue' || item.id === 'honda-cg-150' ? match.image : item.image,
                  colors: mergedColors,
                };
              }),
              ...newOfficialModels,
            ];
            window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(merged));
            window.localStorage.setItem(CATALOG_SCHEMA_VERSION_KEY, CURRENT_CATALOG_VERSION);
          }

          setMotorcycles(merged);
        } else {
          setMotorcycles(INITIAL_MOTORCYCLES);
          window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(INITIAL_MOTORCYCLES));
          window.localStorage.setItem(CATALOG_SCHEMA_VERSION_KEY, CURRENT_CATALOG_VERSION);
        }
      } else {
        setMotorcycles(INITIAL_MOTORCYCLES);
        window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(INITIAL_MOTORCYCLES));
        window.localStorage.setItem(CATALOG_SCHEMA_VERSION_KEY, CURRENT_CATALOG_VERSION);
      }

      const savedInquiries = window.localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (savedInquiries) {
        const parsedInq = JSON.parse(savedInquiries) as ContactInquiry[];
        if (Array.isArray(parsedInq)) {
          setInquiries(parsedInq);
        }
      }
    } catch (err) {
      setStorageError(
        err instanceof Error
          ? `Could not read saved catalog data: ${err.message}`
          : 'Could not read saved catalog data from browser storage.'
      );
      setMotorcycles(INITIAL_MOTORCYCLES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistCatalog = useCallback((nextList: Motorcycle[]): StorageResult => {
    try {
      window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(nextList));
      setMotorcycles(nextList);
      setStorageError(null);
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof Error && err.name === 'QuotaExceededError'
          ? 'Browser storage quota exceeded. Try using a smaller image file or a preset image.'
          : 'Failed to save changes to browser storage.';
      setStorageError(message);
      return { ok: false, error: message };
    }
  }, []);

  const addMotorcycle = useCallback(
    (input: Omit<Motorcycle, 'id' | 'slug'>): StorageResult & { id?: string } => {
      const baseSlug = slugifyModelName(input.name) || 'honda-model';
      const uniqueId = `${baseSlug}-${Date.now().toString(36)}`;
      const newBike: Motorcycle = {
        ...input,
        id: uniqueId,
        slug: uniqueId,
      };
      const result = persistCatalog([newBike, ...motorcycles]);
      return { ...result, id: uniqueId };
    },
    [motorcycles, persistCatalog]
  );

  const updateMotorcycle = useCallback(
    (id: string, updates: Partial<Motorcycle>): StorageResult => {
      const nextList = motorcycles.map((bike) =>
        bike.id === id ? { ...bike, ...updates, id: bike.id } : bike
      );
      return persistCatalog(nextList);
    },
    [motorcycles, persistCatalog]
  );

  const updatePrice = useCallback(
    (id: string, pricePKR: number | null, priceConfirmed: boolean): StorageResult => {
      const today = new Date().toISOString().split('T')[0];
      const nextList = motorcycles.map((bike) =>
        bike.id === id
          ? {
              ...bike,
              pricePKR: priceConfirmed ? pricePKR : null,
              priceConfirmed,
              lastUpdated: today,
            }
          : bike
      );
      return persistCatalog(nextList);
    },
    [motorcycles, persistCatalog]
  );

  const toggleFeatured = useCallback(
    (id: string): StorageResult => {
      const nextList = motorcycles.map((bike) =>
        bike.id === id ? { ...bike, isFeatured: !bike.isFeatured } : bike
      );
      return persistCatalog(nextList);
    },
    [motorcycles, persistCatalog]
  );

  const deleteMotorcycle = useCallback(
    (id: string): StorageResult => {
      const nextList = motorcycles.filter((bike) => bike.id !== id);
      return persistCatalog(nextList);
    },
    [motorcycles, persistCatalog]
  );

  const resetToOfficialDefaults = useCallback((): StorageResult => {
    window.localStorage.setItem(CATALOG_SCHEMA_VERSION_KEY, CURRENT_CATALOG_VERSION);
    return persistCatalog(INITIAL_MOTORCYCLES);
  }, [persistCatalog]);

  const addInquiry = useCallback(
    (inquiry: Omit<ContactInquiry, 'id' | 'submittedAt'>): StorageResult => {
      const record: ContactInquiry = {
        ...inquiry,
        id: `INQ-${Date.now().toString(36).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
      };
      const nextInquiries = [record, ...inquiries];
      try {
        window.localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(nextInquiries));
        setInquiries(nextInquiries);
        return { ok: true };
      } catch {
        return { ok: false, error: 'Unable to save inquiry locally.' };
      }
    },
    [inquiries]
  );

  const deleteInquiry = useCallback(
    (id: string) => {
      const nextInquiries = inquiries.filter((item) => item.id !== id);
      setInquiries(nextInquiries);
      try {
        window.localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(nextInquiries));
      } catch {
        // Ignore non-critical cleanup error
      }
    },
    [inquiries]
  );

  const latestPriceUpdateDate = useMemo(() => {
    if (motorcycles.length === 0) return OFFICIAL_PRICE_REFERENCE_DATE;
    const dates = motorcycles
      .map((m) => m.lastUpdated)
      .filter(Boolean)
      .sort((a, b) => (a > b ? -1 : 1));
    return dates[0] || OFFICIAL_PRICE_REFERENCE_DATE;
  }, [motorcycles]);

  const clearError = useCallback(() => setStorageError(null), []);

  return {
    motorcycles,
    inquiries,
    isLoading,
    storageError,
    clearError,
    latestPriceUpdateDate,
    addMotorcycle,
    updateMotorcycle,
    updatePrice,
    toggleFeatured,
    deleteMotorcycle,
    resetToOfficialDefaults,
    addInquiry,
    deleteInquiry,
  };
}
