import React, { useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Theme,
    ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';
import { themeLight, themeDark } from './themes';

interface Props {
    children: ReactNode,
}

export default function ThemeProvider(props: Props) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [manualTheme, setManualTheme] = useState<'light' | 'dark'>();
    const theme = useMemo(() => {
        if ((!manualTheme && prefersDarkMode) || manualTheme === 'dark') {
            return themeDark;
        }

        return themeLight;
    },[manualTheme, prefersDarkMode]);

    const toggleThemeHandler = useCallback(() => {
        const currentTheme = manualTheme || theme.palette.mode;
        let newTheme: 'light' | 'dark';

        if (currentTheme === 'dark') {
            newTheme = 'light';
        } else {
            newTheme = 'dark';
        }

        setManualTheme(newTheme);
    }, [manualTheme, theme]);

    useEffect(() => {
        document.documentElement.className = theme.palette.mode;
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme: toggleThemeHandler
            }}
        >
            <MUIThemeProvider theme={theme}>
                {props.children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
}

interface ThemeContextType {
    theme?: Theme,
    toggleTheme?: () => void,
}

export const ThemeContext = React.createContext<ThemeContextType>({});
