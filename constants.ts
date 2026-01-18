
import { Country, TranslationStrings } from './types';

export const API_CONFIG = {
  EXCHANGE_RATE_KEY: 'a06a5496ee0d90cef5bcb62924325393',
  CLOUDINARY_URL: 'cloudinary://935912428268229:9P_St-D8wYiG1kysaQM0dHQ7l6k@dxuhj3uuz',
};

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$', rate: 1 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', symbol: 'ر.س', rate: 3.75 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ', rate: 3.67 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', symbol: 'ج.م', rate: 48.50 },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', currency: 'TND', symbol: 'د.ت', rate: 3.10 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', currency: 'MAD', symbol: 'د.م.', rate: 10.10 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', symbol: '¥', rate: 151.0 },
];

export const TRANSLATIONS: TranslationStrings = {
  welcome: { en: "The Wealth Protocol", ar: "بروتوكول الثراء العالمي", fr: "Le Protocole de Richesse", es: "El Protocolo de Riqueza" },
  tagline: { en: "Elite Asset Management & Global Trade", ar: "إدارة الأصول النخبوية والتجارة العالمية", fr: "Gestion d'actifs d'élite & commerce mondial", es: "Gestión de activos de élite y comercio global" },
  explore: { en: "ENTER ECOSYSTEM", ar: "دخول النظام البيئي", fr: "ENTRER DANS L'ÉCOSYSTÈME", es: "ENTRAR AL ECOSISTEMA" },
  realEstate: { en: "Estate & Rental", ar: "العقارات والكراء", fr: "Immobilier & Location", es: "Bienes Raíces y Alquiler" },
  crypto: { en: "Capital", ar: "رأس المال", fr: "Capital", es: "Capital" },
  jobs: { en: "Careers", ar: "المسارات المهنية", fr: "Carrières", es: "Carreras" },
  freelance: { en: "Expertise", ar: "الخبرات", fr: "Expertise", es: "Experticia" },
  ecommerce: { en: "Market", ar: "السوق الرقمي", fr: "Marché", es: "Mercado" },
  travel: { en: "Mobility", ar: "التنقل العالمي", fr: "Mobilité", es: "Movilidad" },
  cars: { en: "Automotive", ar: "السيارات والمحركات", fr: "Automobile", es: "Automotriz" },
  startSelling: { en: "LIST ASSET", ar: "نشر أصل", fr: "LISTER UN ACTIF", es: "LISTAR ACTIVO" }
};
