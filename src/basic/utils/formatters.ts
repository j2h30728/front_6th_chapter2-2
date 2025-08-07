export const formatters = {
  price: (price: number, showSymbol: boolean = true): string => {
    if (showSymbol) {
      return `₩${price.toLocaleString()}`;
    }
    return `${price.toLocaleString()}원`;
  },

  couponCode: (input: string): string =>
    input.trim().toUpperCase().replace(/\s+/g, "-"),
};
