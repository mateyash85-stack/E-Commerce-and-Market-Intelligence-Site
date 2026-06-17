// Prices are stored as INR in the DB — no conversion needed.

export const toINR = (inr: number): number => Math.round(inr)

export const formatINR = (inr: number): string =>
  `₹${Math.round(inr).toLocaleString('en-IN')}`
