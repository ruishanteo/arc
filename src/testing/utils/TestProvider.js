import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material";

import { store } from "../../stores/store.js";

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "14px",
          padding: "8px 12px",
          borderRadius: "50px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
          opacity: "0.9",
          color: "black",
          backgroundColor: "#DBD4F0",
        },
      },
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  status: {
    danger: "#ebaaa7",
  },
  palette: {
    primary: {
      main: "#e0fbff",
      darker: "#053e85",
    },
    neutral: {
      main: "#b7b0f5",
      contrastText: "#fff",
    },
  },
});

export const testStore = store;

export const TestProvider = ({ initialRoute = "/", children }) => {
  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
    </ThemeProvider>
  );
};

export const TestProviderWithStore = ({ initialRoute = "/", children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </Provider>
    </ThemeProvider>
  );
};

export async function delay(t) {
  await new Promise((r) => setTimeout(r, t));
}
