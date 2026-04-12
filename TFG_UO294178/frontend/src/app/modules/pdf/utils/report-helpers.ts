export function formatDate(date: any): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return '';
  }
}

export function valueOrDash(value: any): string {
  if (value === 0) return '0';
  return value === null || value === undefined || value === '' ? '--' : String(value);
}
