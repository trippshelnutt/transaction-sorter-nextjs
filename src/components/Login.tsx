import { Container, Typography, Button } from '@mui/material';

export function Login() {
  return (
    <Container>
      <Typography variant="h2" component="h1" sx={{ textAlign: 'center', mt: 4 }}>
        Please log in to continue
      </Typography>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '2rem',
        gap: '1rem'
      }}>
        <Button 
          variant="contained" 
          color="primary"
          href="/auth/login"
        >
          Log in
        </Button>
      </div>
    </Container>
  );
}