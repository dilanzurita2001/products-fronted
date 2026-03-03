import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    background: {
      default: '#0b1220',
      paper: '#101a2f',
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
  },
});
