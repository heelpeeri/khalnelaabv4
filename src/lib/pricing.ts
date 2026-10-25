export const PRICING = {
  currency: "SAR",
  basePrice: 59,
  salePrice: 49,
  onSale: true,
};

export function getCurrentPrice() {
  return PRICING.onSale ? PRICING.salePrice : PRICING.basePrice;
}

export function toHalalas(riyals: number) {
  return Math.round(riyals * 100);
}

export function isAcceptedAmount(halalas: number) {
  return [PRICING.salePrice, PRICING.basePrice]
    .map(toHalalas)
    .includes(halalas);
}
