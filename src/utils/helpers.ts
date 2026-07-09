export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
