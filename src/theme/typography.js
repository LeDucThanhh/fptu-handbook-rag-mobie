export const fontFamilies = {
  regular: 'Urbanist_400Regular',
  medium: 'Urbanist_500Medium',
  semiBold: 'Urbanist_600SemiBold',
  bold: 'Urbanist_700Bold',
  extraBold: 'Urbanist_800ExtraBold'
};

const typography = {
  fontFamily: fontFamilies.regular,
  heading: {
    h1: { fontSize: 32, lineHeight: 38, fontFamily: fontFamilies.extraBold },
    h2: { fontSize: 28, lineHeight: 34, fontFamily: fontFamilies.bold },
    h3: { fontSize: 24, lineHeight: 30, fontFamily: fontFamilies.bold },
    h4: { fontSize: 20, lineHeight: 26, fontFamily: fontFamilies.semiBold },
    h5: { fontSize: 18, lineHeight: 24, fontFamily: fontFamilies.semiBold },
    h6: { fontSize: 16, lineHeight: 22, fontFamily: fontFamilies.medium }
  },
  body: {
    large: { fontSize: 18, lineHeight: 26, fontFamily: fontFamilies.regular },
    medium: { fontSize: 16, lineHeight: 24, fontFamily: fontFamilies.regular },
    small: { fontSize: 14, lineHeight: 20, fontFamily: fontFamilies.regular },
    tiny: { fontSize: 12, lineHeight: 18, fontFamily: fontFamilies.regular }
  },
  button: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontFamily: fontFamilies.medium,
    lineHeight: 16
  }
};

export default typography;

