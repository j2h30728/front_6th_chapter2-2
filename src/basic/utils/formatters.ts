export const formatPrice = (
  price: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "KRW",
    currencyDisplay: "narrowSymbol",
  };

  const formatter = new Intl.NumberFormat("ko-KR", {
    ...defaultOptions,
    ...options,
  });

  return formatter.format(price);
};
