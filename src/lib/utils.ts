// Format tuition range
export function formatTuition(min: number | null, max: number | null): string {
  if (!min && !max) return 'No reportado';
  if (min === 0 && max === 0) return 'Gratuito';
  if (min && max) return `RD$${min.toLocaleString()} - RD$${max.toLocaleString()}`;
  if (min) return `Desde RD$${min.toLocaleString()}`;
  return `Hasta RD$${max!.toLocaleString()}`;
}

// Get rating color
export function getRatingColor(rating: number): string {
  if (rating >= 9) return '#10b981';
  if (rating >= 8) return '#3b82f6';
  if (rating >= 7) return '#f59e0b';
  return '#ef4444';
}

// Get rating label
export function getRatingLabel(rating: number): string {
  if (rating >= 9) return 'Excelente';
  if (rating >= 8) return 'Muy bueno';
  if (rating >= 7) return 'Bueno';
  return 'En desarrollo';
}

// Generate slug from name
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Check if email is institutional
export function isInstitutionalEmail(email: string): boolean {
  const personal = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'live.com', 'icloud.com', 'aol.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  if (domain.includes('.edu.')) return true;
  if (domain.endsWith('.edu.do')) return true;
  return !personal.includes(domain);
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
