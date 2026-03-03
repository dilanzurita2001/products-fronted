import { useState } from 'react';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import Layout from '../components/Layout';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password)
  }
`;

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data: any) => {
      setSuccess(data.register);
      setTimeout(() => navigate('/login'), 1200);
    },
    onError: (e) => setError('Error: ' + e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    register({ variables: { username, password } });
  };

  return (
    <Layout title="Challenge - Auth">
      <Card sx={{ maxWidth: 460, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Register
          </Typography>
          <Typography sx={{ opacity: 0.8, mt: 1 }}>
            Crea una cuenta para continuar.
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
              autoComplete="new-password"
              required
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button size="large" variant="contained" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Crear cuenta'}
            </Button>

            <Button variant="text" onClick={() => navigate('/login')}>
              Ya tengo cuenta
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Layout>
  );
}
