import type { categories } from '../data/categories';

export type CategorySlug = (typeof categories)[number]['slug'];

// Modelo demonstrativo; dados comerciais serão validados antes da publicação.
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  image: string;
  imageAlt: string;
  priceInCents: number | null;
  availability: 'unknown' | 'available' | 'unavailable';
}
