const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

// Signed amounts use a leading "+ " / "− " (minus sign, not hyphen) per the design tokens.
export function formatSigned(value: number): string {
  const sign = value >= 0 ? '+ ' : '− ';
  return sign + currencyFormatter.format(Math.abs(value));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export interface AvatarColors {
  background: string;
  color: string;
}

const AVATAR_PALETTE: AvatarColors[] = [
  { background: '#eff4ff', color: '#1d4ed8' },
  { background: '#ecfdf3', color: '#067647' },
  { background: '#fef3f2', color: '#b42318' },
  { background: '#f4f3ff', color: '#5925dc' },
  { background: '#fffaeb', color: '#b54708' },
  { background: '#f0f9ff', color: '#026aa2' },
];

export function getAvatarColors(index: number): AvatarColors {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}
