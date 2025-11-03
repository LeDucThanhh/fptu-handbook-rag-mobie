// Theme colors: Orange and White
export const COLORS = {
  // Primary orange colors
  primary: '#FF6B35', // Main orange
  primaryLight: '#FF8C5A',
  primaryDark: '#E55720',
  
  // White and grays
  white: '#FFFFFF',
  background: '#FFFFFF',
  backgroundSecondary: '#FFF8F3', // Light orange tint
  
  // Text colors
  text: '#2C2C2C',
  textSecondary: '#666666',
  textLight: '#999999',
  
  // Accent colors
  accent: '#FFB366',
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
  info: '#1890FF',
  
  // Borders and dividers
  border: '#E8E8E8',
  divider: '#F0F0F0',
  
  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Font family - SVN Product Sans
export const FONTS = {
  regular: 'SVN-Product Sans',
  medium: 'SVN-Product Sans Medium',
  bold: 'SVN-Product Sans Bold',
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

// Ant Design Theme Override
export const antdTheme = {
  brand_primary: COLORS.primary,
  brand_primary_tap: COLORS.primaryDark,
  color_link: COLORS.primary,
  primary_button_fill: COLORS.primary,
  primary_button_fill_tap: COLORS.primaryDark,
};

export default {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  antdTheme,
};
