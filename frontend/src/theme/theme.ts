import { createTheme, ThemeOptions } from '@mui/material/styles';

// Dynamic MUI Theme generator for NIRDC Logo Theme (Light & Dark mode)
export const getMuiTheme = (mode: 'light' | 'dark' = 'light') => {
  const isDark = mode === 'dark';

  const themeColors = {
    primary: {
      main: isDark ? '#9C3872' : '#6B1D4A',        // Eye-friendly medium plum in dark mode, deep plum in light
      light: isDark ? '#B84B8E' : '#8C2963',
      dark: isDark ? '#6B1D4A' : '#4C1333',
      contrastText: '#ffffff',
    },
    secondary: {
      main: isDark ? '#FA8046' : '#E66127',       // Vibrant Swirl Orange
      light: '#FA8046',
      dark: '#B83A00',
      contrastText: '#ffffff',
    },
    error: {
      main: '#D32F2F',
      light: '#f44336',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F2B705',                           // Swirl Gold Accent
      light: '#FAD154',
      dark: '#B88A00',
      contrastText: '#ffffff',
    },
    info: {
      main: isDark ? '#4A97EC' : '#1976D2',
      light: '#2196f3',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    success: {
      main: isDark ? '#4CAF50' : '#2E7D32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    background: {
      default: isDark ? '#0D050A' : '#FAFAFA',
      paper: isDark ? '#1A0D15' : '#FFFFFF',
    },
    text: {
      primary: isDark ? '#F8FAFC' : '#1A1A2E',
      secondary: isDark ? '#D4A5BC' : '#4A5568',
    },
    divider: isDark ? '#3D1E31' : '#EBEBEB',
  };

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      ...themeColors,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        color: themeColors.text.primary,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        color: themeColors.text.primary,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        color: themeColors.text.primary,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: themeColors.text.primary,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: themeColors.text.primary,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        color: themeColors.text.primary,
      },
      body1: {
        fontSize: '1rem',
        color: themeColors.text.primary,
        lineHeight: 1.7,
      },
      body2: {
        fontSize: '0.875rem',
        color: themeColors.text.secondary,
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};

export const theme = getMuiTheme('light');
export const themeColorValues = {
  primary: { main: '#6B1D4A', light: '#8C2963', dark: '#4C1333' },
  secondary: { main: '#E66127', light: '#FA8046', dark: '#B83A00' },
};

export default theme;
