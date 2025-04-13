import { Typography, Container } from '@mui/material';

export default function Home() {
  return (
    <Container>
      <Typography variant="h2" component="h1" sx={{ textAlign: 'center', mt: 4 }}>
        Transaction Sorter
      </Typography>
    </Container>
  );
}
