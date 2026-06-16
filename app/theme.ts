import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#d97706",
      light: "#f59e0b",
      dark: "#b45309",
    },
    secondary: {
      main: "#92400e",
      light: "#b45309",
      dark: "#78350f",
    },
    background: {
      default: "#fffbeb",
      paper: "#fef3c7",
    },
    text: {
      primary: "#1c0a00",
      secondary: "#92400e",
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#fffbeb" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: "100px" },
      },
    },
  },
});
