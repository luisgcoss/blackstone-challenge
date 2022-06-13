import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { Provider } from 'react-redux';

import { store } from './redux';
import styles from 'app/style/output.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Blackstone challenge',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 font-quicksand">
        <Provider store={store}>
          <Outlet />
        </Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
