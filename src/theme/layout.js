import { StyleSheet } from 'react-native';

export const createSurfaceScrollStyles = (theme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      marginTop: -(theme.spacing?.md ?? 12),
      borderTopLeftRadius: theme.radii?.lg ?? 20,
      borderTopRightRadius: theme.radii?.lg ?? 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      zIndex: 2
    },
    content: {
      paddingHorizontal: theme.spacing?.xl ?? 24,
      paddingTop: theme.spacing?.xl ?? 24,
      paddingBottom: theme.spacing?.xxl ?? theme.spacing?.xl ?? 24
    }
  });

export default createSurfaceScrollStyles;

