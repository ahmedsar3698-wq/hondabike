import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppRoute } from './types/motorcycle';
import { useMotorcycles } from './hooks/useMotorcycles';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BikeCompareBar } from './components/BikeCompareBar';
import { HomePage } from './pages/HomePage';
import { CollectionPage, EngineFilter } from './pages/CollectionPage';
import { BikeDetailsPage } from './pages/BikeDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

function parseHashToRoute(): AppRoute {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'home') return { page: 'home' };
  if (hash === 'collection') return { page: 'collection' };
  if (hash === 'about') return { page: 'about' };
  if (hash === 'admin') return { page: 'admin' };
  if (hash.startsWith('contact')) {
    const [, query] = hash.split('?');
    const params = new URLSearchParams(query || '');
    const bikeId = params.get('bike') || undefined;
    return { page: 'contact', preselectedBikeId: bikeId };
  }
  if (hash.startsWith('bike/')) {
    const raw = hash.slice('bike/'.length);
    const [rawId, query] = raw.split('?');
    const id = decodeURIComponent(rawId);
    const params = new URLSearchParams(query || '');
    const color = params.get('color') || undefined;
    return { page: 'details', id, color };
  }
  return { page: 'home' };
}

function routeToHash(route: AppRoute): string {
  switch (route.page) {
    case 'home':
      return '#/';
    case 'collection':
      return '#/collection';
    case 'about':
      return '#/about';
    case 'admin':
      return '#/admin';
    case 'contact':
      return route.preselectedBikeId
        ? `#/contact?bike=${encodeURIComponent(route.preselectedBikeId)}`
        : '#/contact';
    case 'details':
      return route.color
        ? `#/bike/${encodeURIComponent(route.id)}?color=${encodeURIComponent(route.color)}`
        : `#/bike/${encodeURIComponent(route.id)}`;
  }
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseHashToRoute());
  const [collectionEnginePreset, setCollectionEnginePreset] = useState<EngineFilter>('all');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const {
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
  } = useMotorcycles();

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHashToRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((nextRoute: AppRoute, enginePreset?: string) => {
    if (nextRoute.page === 'collection') {
      setCollectionEnginePreset((enginePreset as EngineFilter) || 'all');
    }
    const nextHash = routeToHash(nextRoute);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  }, []);

  const comparedBikes = useMemo(
    () =>
      compareIds
        .map((id) => motorcycles.find((m) => m.id === id))
        .filter((m): m is NonNullable<typeof m> => Boolean(m)),
    [compareIds, motorcycles]
  );

  const activeBike =
    route.page === 'details'
      ? motorcycles.find((m) => m.id === route.id || m.slug === route.id)
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C0E] text-[#F4F5F7]">
      <Navbar currentRoute={route} onNavigate={navigate} />

      <main className="flex-1">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="h-96 rounded-lg bg-[#131519] border border-[#222630] animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {route.page === 'home' && (
              <HomePage
                motorcycles={motorcycles}
                latestPriceUpdateDate={latestPriceUpdateDate}
                compareIds={compareIds}
                onToggleCompare={handleToggleCompare}
                onNavigate={navigate}
              />
            )}

            {route.page === 'collection' && (
              <CollectionPage
                motorcycles={motorcycles}
                latestPriceUpdateDate={latestPriceUpdateDate}
                initialEngineFilter={collectionEnginePreset}
                compareIds={compareIds}
                onToggleCompare={handleToggleCompare}
                onNavigate={navigate}
              />
            )}

            {route.page === 'details' && (
              <BikeDetailsPage
                motorcycle={activeBike}
                initialColorName={route.color}
                allMotorcycles={motorcycles}
                compareIds={compareIds}
                onToggleCompare={handleToggleCompare}
                onNavigate={navigate}
              />
            )}

            {route.page === 'about' && (
              <AboutPage
                motorcycles={motorcycles}
                latestPriceUpdateDate={latestPriceUpdateDate}
                onNavigate={navigate}
              />
            )}

            {route.page === 'contact' && (
              <ContactPage
                motorcycles={motorcycles}
                preselectedBikeId={route.preselectedBikeId}
                onSubmitInquiry={addInquiry}
              />
            )}

            {route.page === 'admin' && (
              <AdminPage
                motorcycles={motorcycles}
                inquiries={inquiries}
                latestPriceUpdateDate={latestPriceUpdateDate}
                storageError={storageError}
                onClearError={clearError}
                onAddMotorcycle={addMotorcycle}
                onUpdateMotorcycle={updateMotorcycle}
                onUpdatePrice={updatePrice}
                onToggleFeatured={toggleFeatured}
                onDeleteMotorcycle={deleteMotorcycle}
                onResetDefaults={resetToOfficialDefaults}
                onDeleteInquiry={deleteInquiry}
                onNavigate={navigate}
              />
            )}
          </>
        )}
      </main>

      <BikeCompareBar
        selectedBikes={comparedBikes}
        onRemoveBike={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        onClearAll={() => setCompareIds([])}
        onNavigate={navigate}
      />

      <Footer latestPriceUpdateDate={latestPriceUpdateDate} onNavigate={navigate} />
    </div>
  );
}
