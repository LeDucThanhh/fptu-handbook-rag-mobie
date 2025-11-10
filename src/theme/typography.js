import { Platform } from 'react-native';

const systemFont = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const fontFamilies = {
  regular: systemFont,
  medium: systemFont,
  semiBold: systemFont,
  bold: systemFont,
  extraBold: systemFont
};

const createTextStyle = (fontSize, lineHeight, fontWeight = '400') => ({
  fontSize,
  lineHeight,
  fontFamily: systemFont,
  fontWeight
});

const typography = {
  fontFamily: systemFont,
  heading: {
    h1: createTextStyle(32, 38, '800'),
    h2: createTextStyle(28, 34, '700'),
    h3: createTextStyle(24, 30, '700'),
    h4: createTextStyle(20, 26, '600'),
    h5: createTextStyle(18, 24, '600'),
    h6: createTextStyle(16, 22, '500')
  },
  body: {
    large: createTextStyle(18, 26),
    medium: createTextStyle(16, 24),
    small: createTextStyle(14, 20),
    tiny: createTextStyle(12, 18)
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: systemFont,
    fontWeight: '600'
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: systemFont,
    fontWeight: '500'
  }
};

export default typography;
