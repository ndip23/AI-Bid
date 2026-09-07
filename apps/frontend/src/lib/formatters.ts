/**
 * Formats monetary amounts gracefully across African (XAF, NGN, KES, GHS) and Global currencies (USD, EUR, GBP).
 * If amount is 0 or unspecified, returns 'Non Spécifié / On Request'.
 */
export function formatCurrency(val?: number | null, curr?: string | null): string {
  if (!val || val <= 0) {
    return 'Non Spécifié / On Request';
  }

  const currencyCode = (curr || 'USD').trim().toUpperCase();

  // For very large numbers (>= 1 Million), provide compact formatting alongside or directly
  if (val >= 1_000_000_000) {
    return `${currencyCode === 'USD' ? '$' : ''}${(val / 1_000_000_000).toFixed(2)}B ${currencyCode !== 'USD' ? currencyCode : ''}`.trim();
  }
  if (val >= 1_000_000) {
    return `${currencyCode === 'USD' ? '$' : ''}${(val / 1_000_000).toFixed(1)}M ${currencyCode !== 'USD' ? currencyCode : ''}`.trim();
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(val);
  } catch (e) {
    return `${val.toLocaleString()} ${currencyCode}`;
  }
}

/**
 * Formats compact sum for dashboard pipeline metrics (USD standard).
 */
export function formatPipelineValue(sumUSD: number): string {
  if (!sumUSD || sumUSD <= 0) return '$0';

  if (sumUSD >= 1_000_000_000) {
    return `$${(sumUSD / 1_000_000_000).toFixed(2)}B`;
  }
  if (sumUSD >= 1_000_000) {
    return `$${(sumUSD / 1_000_000).toFixed(1)}M`;
  }
  if (sumUSD >= 1_000) {
    return `$${(sumUSD / 1_000).toFixed(0)}K`;
  }
  return `$${Math.round(sumUSD).toLocaleString()}`;
}
