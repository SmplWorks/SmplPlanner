import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import AppContextProvider from "./context";

export default function App() {
  return (
    <Router
      root={AppContextProvider}
    >
      <FileRoutes />
    </Router>
  );
}
