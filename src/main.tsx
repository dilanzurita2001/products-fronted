import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router/dom';
import { ApolloProvider } from '@apollo/client/react';
import { createBrowserRouter } from 'react-router';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';

import client from './apolloClient';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/products', element: <Products /> },
]);

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </ApolloProvider>
);
