export const priceCalculator = (price, tax, discount = 0) => {
    const priceWithTax = Number(price) + (tax / 100) * Number(price);

    if (discount > 0) {
        const priceWithDiscount = priceWithTax - (priceWithTax * (discount / 100));
        return priceWithDiscount; 
    }

    return priceWithTax; 
}