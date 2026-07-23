export function formatNaira(amount: number): string {
  if (isNaN(amount)) return '₦0';
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}
