import { useMemo, useState } from 'react';
import { gql } from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/GridLegacy';

import Layout from '../components/Layout';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

type GetProductsData = {
  products: Product[];
};

export default function Products() {
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0 });
  const [uiError, setUiError] = useState<string>('');

  const { loading, error, data, refetch } = useQuery<GetProductsData>(GET_PRODUCTS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const products: Product[] = useMemo(() => (data?.products ?? []) as Product[], [data]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const openCreate = () => {
    setUiError('');
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0 });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setUiError('');
    setEditingProduct(p);
    setFormData({ name: p.name, description: p.description, price: p.price });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setUiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiError('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(String(formData.price)),
      };

      if (editingProduct) {
        await updateProduct({ variables: { id: editingProduct.id, input: payload } });
      } else {
        await createProduct({ variables: { input: payload } });
      }

      closeDialog();
      refetch();
    } catch (err: any) {
      setUiError(err?.message ?? 'Error saving product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct({ variables: { id } });
      refetch();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return (
      <Layout title="Products" onLogout={handleLogout}>
        <Typography sx={{ textAlign: 'center', mt: 6, opacity: 0.8 }}>Loading...</Typography>
      </Layout>
    );
  }

  if (error) {
    if (error.message.includes('Unauthorized') || error.message.includes('403')) {
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    }

    return (
      <Layout title="Products" onLogout={handleLogout}>
        <Alert severity="error">Error: {error.message}</Alert>
      </Layout>
    );
  }

  return (
    <Layout title="Products" onLogout={handleLogout}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Productos
          </Typography>
          <Typography sx={{ opacity: 0.8, mt: 0.5 }}>
            CRUD conectado por GraphQL.
          </Typography>
        </Box>

        <Button variant="contained" onClick={openCreate}>
          + Nuevo producto
        </Button>
      </Stack>

      {products.length === 0 ? (
        <Card sx={{ p: 3 }}>
          <Typography sx={{ opacity: 0.85 }}>No products found. Crea el primero.</Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} key={p.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {p.name}
                    </Typography>
                    <Chip label={`$${p.price.toFixed(2)}`} />
                  </Stack>

                  <Typography sx={{ mt: 1, opacity: 0.85 }}>
                    {p.description || 'Sin descripción'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button variant="outlined" onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                  <Button color="error" variant="outlined" onClick={() => handleDelete(p.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>{editingProduct ? 'Editar producto' : 'Crear producto'}</DialogTitle>
        <DialogContent>
          <Stack component="form" id="product-form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              label="Price"
              type="number"
              inputProps={{ step: '0.01' }}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value || '0') })}
              required
              fullWidth
            />
            {uiError && <Alert severity="error">{uiError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={closeDialog}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" form="product-form">
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
