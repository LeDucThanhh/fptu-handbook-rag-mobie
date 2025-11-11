import { Platform } from 'react-native';

const systemFont = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const fontFamilies = {
  regular: 'Urbanist_400Regular',
  medium: 'Urbanist_500Medium',
  semiBold: 'Urbanist_600SemiBold',
  bold: 'Urbanist_700Bold',
  extraBold: 'Urbanist_800ExtraBold',
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
    h1: createTextStyle(32, 38, 'extraBold'),
    h2: createTextStyle(28, 34, 'bold'),
    h3: createTextStyle(24, 30, 'bold'),
    h4: createTextStyle(20, 26, 'semiBold'),
    h5: createTextStyle(18, 24, 'semiBold'),
    h6: createTextStyle(16, 22, 'medium')
  },
  body: {
    large: createTextStyle(18, 26, 'regular'),
    medium: createTextStyle(16, 24, 'regular'),
    small: createTextStyle(14, 20, 'regular'),
    tiny: createTextStyle(12, 18, 'regular')
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: resolveFontFamily('semiBold')
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: resolveFontFamily('medium')
  }
};

export default typography;
