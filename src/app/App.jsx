import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { MatxTheme } from "./components";
// ALL CONTEXTS
import { AuthProvider } from "./contexts/JWTAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
// ROUTES
import routes from "./routes";
// FAKE SERVER
import "../fake-db";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function App() {
  const content = useRoutes(routes);

  // some change to file

  return (
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MatxTheme>
            <CssBaseline />
            {content}
          </MatxTheme>
        </AuthProvider>
      </QueryClientProvider>
    </SettingsProvider>
  );
}
