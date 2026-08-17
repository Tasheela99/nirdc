import { createContext, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getMuiTheme } from '../theme/theme';

interface DarkModeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  isDark: false,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const isDark = false;
  const muiTheme = useMemo(() => getMuiTheme('light'), []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('nirdc-dark-mode');
  }, []);

  const toggleDarkMode = useCallback(() => {
    // Dark mode is completely disabled
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
