"use client";

import { useEffect, useState } from "react";
import { ShoppingContext } from "@/context/Shopping/ShoppingContext";
import { useToast } from "@/hooks/useToast";

export function ShoppingContextProvider({ children }) {

    const [shoppingCart, setShoppingCart] = useState([])
    const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false)
    const [showCart, setShowCart] = useState(false)
    const [cartTotal, setCartTotal] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const { toast, showToast, hideToast } = useToast()

    const handleShoppingCart = () => {
        setShowCart(prevState => !prevState)
    }

    const totalCalculation = (price, tax, discount, quantity) => {
        const basePrice = price * (1 + (tax / 100));
        const discountedPrice = basePrice - (basePrice * (discount / 100));
        const finalPrice = discountedPrice * quantity;
        return Math.round(finalPrice);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem("shoppingCart");
            if (savedCart) {
                setShoppingCart(JSON.parse(savedCart));
            }
            setIsLocalStorageAvailable(true);
        }
    }, []);

    useEffect(() => {
        if (isLocalStorageAvailable) {
            localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
        }
    }, [shoppingCart, isLocalStorageAvailable]);



    useEffect(() => {
        const totalPrice = shoppingCart.reduce((acc, { precio, impuesto, descuento, quantity }) => {
            return quantity > 0 ? acc + totalCalculation(precio, impuesto, descuento, quantity) : acc
        }, 0)
        setCartTotal(totalPrice)
    }, [shoppingCart])

    const handleAddItem = (product, reference) => {
        setIsLoading(true)
        setError(null)
        try {
            const { uuid, titulo, precio, impuesto, descuento, stock, imagenes, seller, dimensiones_producto, tallas_disponibles } = product.attributes
            const sellerInformation = seller.data.attributes

            const sizeSelected = tallas_disponibles.find((talla) => talla.talla === reference)
            
            const isProductInCart = shoppingCart.find(product => product.uuid === uuid)
            isProductInCart ? setError("El producto ya se encuentra en el carrito") :
                setShoppingCart(prevState =>
                    [...prevState,
                    {
                        strapiUUID: product.id,
                        uuid: uuid,
                        titulo: titulo,
                        precio: precio,
                        impuesto: impuesto,
                        imagenes: imagenes,
                        descuento: descuento,
                        stock: stock,
                        quantity: 1,
                        vendedor: sellerInformation,
                        dimensiones: dimensiones_producto,
                        talla: sizeSelected?.talla || null,
                    }])
            setError(null)
            showToast("Producto agregado al carrito", "success")
        } catch (error) {
            setError(error)
            showToast("Error al agregar el producto al carrito", "error")
        }
        finally {
            setIsLoading(false)
            setTimeout(() => {
                hideToast()
            }, 5000)
        }

    }

    const handleDeleteItem = (id) => {
            setShoppingCart(prevState =>
                prevState.filter(product => product.uuid !== id))
    }

    const updateQuantity = (uid, newQuantity) => {
        const updatedCart = shoppingCart.map((product) => {
            if (product.uuid === uid) {
                return {
                    ...product,
                    quantity: newQuantity,
                };
            }
            return product;
        });
        setShoppingCart(updatedCart);
    };

    const handleProductQuantity = (e, uid) => {
        const { target } = e;
        const newQuantity = parseInt(target.value, 10) || 1;
        updateQuantity(uid, newQuantity);
    };

    const handleQuantityChange = (e, uid) => {
        const { target } = e;
        const currentQuantity = shoppingCart.find((product) => product.uuid === uid).quantity;
        const newQuantity =
            target.value === '+'
                ? currentQuantity + 1
                : currentQuantity - 1;
        updateQuantity(uid, newQuantity);
    };

    const emptyCart = () => {
        setShoppingCart([])
    }

    return (
        <ShoppingContext.Provider value={{
            shoppingCart,
            showCart,
            cartTotal,
            handleAddItem,
            handleDeleteItem,
            handleShoppingCart,
            handleProductQuantity,
            handleQuantityChange,
            totalCalculation,
            emptyCart,
            isLoading,
            error,
            toast
        }}>
            {children}
        </ShoppingContext.Provider>
    )
}