export const priceFormatter = (price, tax = 0, discount = 0) => {
  const priceNumber = Number(price) || 0;

  const priceWithTax = priceNumber + (tax / 100) * priceNumber;
  const priceWithDiscount = priceWithTax - (priceWithTax * (discount / 100));

  const formatCurrency = (value) => value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumSignificantDigits: 5
  });

  return [
    formatCurrency(priceWithDiscount),
    formatCurrency(priceWithTax)
  ];
};