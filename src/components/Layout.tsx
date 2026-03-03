import type { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';

type LayoutProps = {
  title?: string;
  children: ReactNode;
  onLogout?: () => void;
  hideLogout?: boolean;
};

export default function Layout({ title = 'MVP Products', children, onLogout, hideLogout }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthScreen = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
  const showLogout = !hideLogout && !isAuthScreen;

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backdropFilter: 'blur(8px)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>

          {showLogout && (
            <Button
              variant="outlined"
              onClick={() => {
                if (onLogout) onLogout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 5 }}>
        {children}
      </Container>
    </>
  );
}
