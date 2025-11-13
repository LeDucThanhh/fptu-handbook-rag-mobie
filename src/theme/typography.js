import { Platform } from 'react-native';

const systemFont = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const fontFamilies = {
  // Dongle font family (default)
  regular: 'Dongle_400Regular',
  light: 'Dongle_300Light',
  bold: 'Dongle_700Bold',
  // Aliases for consistency
  medium: 'Dongle_400Regular',
  semiBold: 'Dongle_700Bold',
  extraBold: 'Dongle_700Bold',
  // Fallback
  fallback: systemFont
};

const resolveFontFamily = (familyKey) => fontFamilies[familyKey] ?? fontFamilies.fallback;

const createTextStyle = (fontSize, lineHeight, familyKey = 'regular') => ({
  fontSize,
  lineHeight,
  fontFamily: resolveFontFamily(familyKey)
});

const typography = {
  fontFamily: resolveFontFamily('regular'),
  heading: {
    h1: createTextStyle(42, 50, 'extraBold'),
    h2: createTextStyle(38, 46, 'bold'),
    h3: createTextStyle(34, 42, 'bold'),
    h4: createTextStyle(30, 38, 'semiBold'),
    h5: createTextStyle(26, 34, 'semiBold'),
    h6: createTextStyle(22, 30, 'medium')
  },
  body: {
    large: createTextStyle(24, 34, 'regular'),
    medium: createTextStyle(22, 32, 'regular'),
    small: createTextStyle(20, 28, 'regular'),
    tiny: createTextStyle(18, 26, 'regular')
  },
  button: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: resolveFontFamily('semiBold')
  },
  caption: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: resolveFontFamily('medium')
  }
};

export default typography;
