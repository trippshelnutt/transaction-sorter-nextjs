import { Typography, Container, Button } from '@mui/material';
import { auth0 } from '@/lib/auth0';

async function getTitle() {
  const res = await fetch('http://localhost:3000/api/title', { cache: 'no-store' });
  const data = await res.json();
  return data.title;
}

export default async function Home() {
  const title = await getTitle();
  const session = await auth0.getSession();
  const user = session?.user;

  if (!session) {
    return (
      <Container>
        <Typography variant="h2" component="h1" sx={{ textAlign: 'center', mt: 4 }}>
          Please log in to view the title.
        </Typography>
        <Button variant="contained" href='/auth/login'>Log in</Button>
      </Container>
    );
  }
  
  return (
    <Container>
      <Typography variant="h2" component="h1" sx={{ textAlign: 'center', mt: 4 }}>
        {title}
        <br />
        Welcome, {user?.name || 'User'}!
      </Typography>
      <Button variant="contained" color="secondary" href='/auth/logout' sx={{ mt: 2 }}>
        Log out
      </Button>
    </Container>
  );
}
