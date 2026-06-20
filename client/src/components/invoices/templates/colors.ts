const DEFAULT_ACCENT = '#6366F1';

export const getAccentColor = (invoiceData: any): string => {
  return invoiceData?.seller?.accentColor || invoiceData?.templateConfig?.accentColor || DEFAULT_ACCENT;
};

export const lightenColor = (hex: string, alpha: number = 0.1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getLightBg = (color: string): string => {
  return lightenColor(color, 0.08);
};
