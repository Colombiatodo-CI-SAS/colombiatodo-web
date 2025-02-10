import { useShoppingCart } from "@/hooks/useShoppingCart"
import { priceFormatter } from "@/utils/priceFormatter"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import ProductSummary from "@/components/Product/ProductSummary"

/* eslint-disable @next/next/no-img-element */
const { X } = require("lucide-react")
const { Button } = require("./Button")

export function CartContainer({ showCart, style, closeCart, items, deleteItem, total }) {
    const { handleProductQuantity, handleQuantityChange } = useShoppingCart()
    const { user } = useAuth()
    const cartLogic = showCart ? "cart-container flex flex-col gap-4 absolute top-0 right-0 w-11/12 md:w-1/3 h-[100dvh] bg-white z-20 shadow-lg py-6 md:py-10 px-4 transition-all" : "hidden"
    const areItems = items.length > 0
    const overlayStyle = "fixed top-0 left-0 w-screen h-[100dvh] bg-black bg-opacity-30"
    const totalFormatted = total ? priceFormatter(total)[0] : "0"


    return (
        <>
            <section className={showCart ? overlayStyle : "hidden"}>
                <div className={overlayStyle} onClick={closeCart}></div>
                <div
                    className={cartLogic}>
                    <header className="flex justify-between items-center font-bold text-sm md:text-base">
                        Carrito de compras
                        <X
                            onClick={closeCart}
                            className={style}
                        />
                    </header>
                    <section className="flex flex-col justify-between">
                        <div>
                            {
                                areItems ?
                                    items.map((product) => {
                                        const { uuid, titulo, precio, impuesto, descuento, quantity, stock, imagenes, talla } = product
                                        const priceQuantity = precio * quantity
                                        const priceFormatted = priceFormatter(priceQuantity, impuesto, descuento);
                                        const [priceWithDiscount, basePrice] = priceFormatted
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
                                                talla={talla}
                                                handleQuantityChange={handleQuantityChange}
                                                deleteItem={deleteItem}
                                                handleProductQuantity={handleProductQuantity}
                                                basePrice={basePrice}
                                            />
                                        )
                                    }) :
                                    <p className="text-center text-xs md:text-sm">No hay productos en el carrito</p>
                            }
                        </div>
                    </section>
                    <footer className="flex flex-col gap-2 absolute bottom-0 left-0 w-full bg-white p-3">
                        <p className="text-sm">Total: <strong>{totalFormatted}</strong></p>
                        {
                            areItems ?
                                <Link href={user ? "/payment" : "/login"} className="w-full">
                                    <Button action={closeCart}>
                                        Proceder a pagar
                                    </Button>
                                </Link>
                                :
                                <Link href={"/productos"}>
                                    <Button action={closeCart}>
                                        Agregar productos
                                    </Button>
                                </Link>
                        }
                    </footer>
                </div>
            </section>
        </>

    )
}