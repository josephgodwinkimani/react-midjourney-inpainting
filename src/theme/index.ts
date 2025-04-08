import { createTheme } from '@mui/material/styles';

// Generate a theme base on the options received
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#5865F2',
        },
        secondary: {
            main: '#2ECC71',
        },
        background: {
            default: '#1E1F22',
            paper: '#2C2F33',
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1.2rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: 24,
                    paddingRight: 24,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});

export { theme };