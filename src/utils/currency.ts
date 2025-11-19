export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numPrice);
};

export const convertUSDtoINR = (usdPrice: number): number => {
  // Approximate conversion rate: 1 USD = 83 INR
  return Math.round(usdPrice * 83);
};