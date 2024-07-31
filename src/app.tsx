import { HashRouter as Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';

import AppContextProvider from '~/context';

export default function App() {
  return (
    <Router
      base={import.meta.env.SERVER_BASE_URL}
      root={AppContextProvider}
    >
      <FileRoutes />
    </Router>
  );
}
