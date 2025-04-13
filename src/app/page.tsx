import { Typography, Container } from '@mui/material';

async function getTitle() {
  const res = await fetch('http://localhost:3000/api/title', { cache: 'no-store' });
  const data = await res.json();
  return data.title;
}

export default async function Home() {
  const title = await getTitle();
  
  return (
    <Container>
      <Typography variant="h2" component="h1" sx={{ textAlign: 'center', mt: 4 }}>
        {title}
      </Typography>
    </Container>
  );
}
