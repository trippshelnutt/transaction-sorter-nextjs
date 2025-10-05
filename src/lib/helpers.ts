export function formatPrice(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' });
}
