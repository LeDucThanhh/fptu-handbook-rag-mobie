import React, { createContext, useContext, useMemo } from 'react';
import colors from './colors';
import typography, { fontFamilies } from './typography';

const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32
};

const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999
};

const elevations = {
  level1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  level2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3
  },
  level3: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6
  }
};

const theme = {
  colors,
  typography,
  spacing,
  radii,
  elevations,
  fontFamilies
};

const ThemeContext = createContext(theme);

export const ThemeProvider = ({ children, value }) => {
  const memoizedTheme = useMemo(() => value ?? theme, [value]);
  return <ThemeContext.Provider value={memoizedTheme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default theme;

