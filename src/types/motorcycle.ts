export interface BikeColor {
  name: string;
  hex: string;
  image?: string;
}

export interface BikeSpecification {
  label: string;
  value: string;
}

export interface Motorcycle {
  id: string;
  slug: string;
  name: string;
  series: string;
  engineCC: number;
  engineLabel: string;
  pricePKR: number | null;
  priceConfirmed: boolean;
  priceNote?: string;
  lastUpdated: string;
  image: string;
  colors: BikeColor[];
  transmission: string;
  startingSystem: string;
  fuelCapacity: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  specifications: BikeSpecification[];
  isFeatured: boolean;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  motorcycleId: string;
  motorcycleName: string;
  message: string;
  submittedAt: string;
}

export type AppRoute =
  | { page: 'home' }
  | { page: 'collection' }
  | { page: 'details'; id: string; color?: string }
  | { page: 'about' }
  | { page: 'contact'; preselectedBikeId?: string }
  | { page: 'admin' };
