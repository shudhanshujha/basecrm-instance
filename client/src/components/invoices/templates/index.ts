import GstStandard from './GstStandard.js';
import DigitalServices from './DigitalServices.js';
import ProductCompany from './ProductCompany.js';
import Freelancer from './Freelancer.js';
import ModernMinimal from './ModernMinimal.js';

export { GstStandard, DigitalServices, ProductCompany, Freelancer, ModernMinimal };

export const TEMPLATES = {
  'gst-standard': {
    id: 'gst-standard',
    name: 'GST Standard',
    description: 'Indian GST-compliant invoice with tax breakdown, HSN codes, and bank details',
    suitableFor: ['registered', 'gst', 'all'],
    preview: null,
  },
  'digital-services': {
    id: 'digital-services',
    name: 'Digital Services',
    description: 'Clean modern layout for agencies, SaaS, consulting, and service-based businesses',
    suitableFor: ['agencies', 'saas', 'consulting', 'digital', 'creative'],
    preview: null,
  },
  'product-company': {
    id: 'product-company',
    name: 'Product / E-Commerce',
    description: 'Itemized format for physical goods, inventory, and product-based companies',
    suitableFor: ['products', 'ecommerce', 'retail', 'manufacturing'],
    preview: null,
  },
  'freelancer': {
    id: 'freelancer',
    name: 'Freelancer / Consultant',
    description: 'Simple, professional layout for independent contractors and consultants',
    suitableFor: ['freelancer', 'consultant', 'solo', 'independent'],
    preview: null,
  },
  'modern-minimal': {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Sleek, borderless design with accent colors for modern brands',
    suitableFor: ['startup', 'modern', 'tech', 'brand'],
    preview: null,
  },
};

export type TemplateId = keyof typeof TEMPLATES;

export const getTemplateComponent = (id: string) => {
  switch (id) {
    case 'gst-standard': return GstStandard;
    case 'digital-services': return DigitalServices;
    case 'product-company': return ProductCompany;
    case 'freelancer': return Freelancer;
    case 'modern-minimal': return ModernMinimal;
    default: return GstStandard;
  }
};
