"use client"
import ProductSummary from "@/components/Product/ProductSummary";
import { priceFormatter } from "@/utils/priceFormatter";
import Link from "next/link";
import { Wallet } from "@mercadopago/sdk-react";

export default function OrderSummary({
    shoppingCart,
    cartTotal,
    cheapestShipping,
    handleQuantityChange,
    handleDeleteItem,
    handleProductQuantity,
    paymentOptions,
    preferenceId
}) {
    const totalFormatted = priceFormatter(cartTotal + cheapestShipping.shippingCost, 0, 0)[0];
    const shippingFormatted = priceFormatter(cheapestShipping.shippingCost, 0, 0)[0];

    const areItems = shoppingCart.length > 0;

    const shippingTimeFormatted = (cheapestShipping.shippingTime / 60) / 24

    return (
        <section>
            <h3 className="text-lg font-black">Resumen de pedido</h3>
            <div className="flex flex-col gap-3">
                {areItems ? (
                    shoppingCart.map((product) => {
                        const { uuid, titulo, precio, impuesto, descuento, quantity, stock, imagenes, talla } = product;
                        const priceQuantity = precio * quantity;
                        const priceFormatted = priceFormatter(priceQuantity, impuesto, descuento);
                        const [priceWithDiscount, basePrice] = priceFormatted;
                        return (
                            <ProductSummary
                                key={uuid}
                                uuid={uuid}
                                titulo={titulo}
                                stock={stock}
                                priceWithDiscount={priceWithDiscount}
                                priceFormatted={priceFormatted}
                                quantity={quantity}
                                imagenes={imagenes}
                                descuento={descuento}
                                handleQuantityChange={handleQuantityChange}
                                deleteItem={handleDeleteItem}
                                talla={talla}
                                handleProductQuantity={handleProductQuantity}
                                basePrice={basePrice}
                            />
                        );
                    })
                ) : (
                    <Link href="/productos" className="text-sm text-balance text-center my-2">
                        Agrega productos a tu pedido
                    </Link>
                )}
            </div>
            <div className="flex flex-col gap-2 mt-2">
            <section className="flex justify-between mt-2">
                <h5 className="text-sm font-semibold text-right">Envío:</h5>
                {cheapestShipping.shippingCost > 0 ? (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <img src={cheapestShipping.img} className="h-6" alt="logo" />
                            <p className="text-sm text-gray-500">{shippingFormatted}</p>
                        </div>
                        <p className="text-sm text-gray-400 text-right">{cheapestShipping.name}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Calculado por destino*</p>
                )}
            </section>
            <p className="text-sm font-semibold text-right flex justify-between">Tiempo estimado de entrega: <span className="text-sm text-gray-500 font-normal">{shippingTimeFormatted} día(s)</span> </p>
            <h4 className="flex justify-between mt-4 text-sm font-black text-right">
                Total de compra: <span>{totalFormatted}</span>
            </h4>
                </div>
            <hr className="mt-3" />
            <h5 className="font-bold text-sm lg:text-base mt-3">Métodos de pago</h5>
            <p className={!paymentOptions ? "text-sm text-gray-400" : "hidden"}>
                Disponibles después de llenar el formulario
            </p>
            {paymentOptions && preferenceId && (
                <section>
                    <ul className="flex flex-col lg:flex-row lg:justify-between gap-3 mt-2">
                        <Wallet initialization={{ preferenceId: preferenceId }} />
                    </ul>
                </section>
            )}
        </section>
    );
}
