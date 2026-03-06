import { useState } from 'react';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';
import { getManagedUser } from '../utils/userAdminStore';

import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import Layout from '../components/Layout';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data: any) => {
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('current_username', username);
      navigate('/products');
    },
    onError: (e) => {
      setError('Error: ' + e.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const managedUser = getManagedUser(username);

    if (managedUser?.disabled) {
      setError('Este usuario está deshabilitado.');
      return;
    }

    login({ variables: { username, password } });
  };

  return (
    <Layout title="Challenge - Auth">
      <Box
        sx={{
          display: 'flex',
          minHeight: '80vh',
          alignItems: 'center',
          gap: 6,
          px: 4,
        }}
      >

        {/* LOGIN */}
        <Card sx={{ maxWidth: 460, width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Login
            </Typography>

            <Typography sx={{ opacity: 0.8, mt: 1 }}>
              Ingresa para gestionar productos.
            </Typography>

            <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <Button size="large" variant="contained" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Entrar'}
              </Button>

              <Button variant="text" onClick={() => navigate('/register')}>
                ¿No tienes cuenta? Regístrate
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* IMAGEN */}
        {/* IMAGEN */}
        <Box
          sx={{
            position: "absolute",
            right: "40px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "55%",
            display: { xs: "none", md: "block" }  // 👈 ESTA ES LA CLAVE
          }}
        >
          <img
            src="/alliance.png"
            alt="Humana Kruger Alliance"
            style={{
              width: "100%",
              height: "auto"
            }}
          />
        </Box>

      </Box>
    </Layout>
  );
}