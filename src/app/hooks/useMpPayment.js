import { useState } from "react"

export const useMpPayment = (shoppingCart, totalCalculation) => {
    const [preferenceId, setPreferenceId] = useState(null)

    const mercadopagoPayment = async (deliveryPrice) => {
        const cartItems = shoppingCart.map((product) => {
            const { titulo, precio, quantity, impuesto, descuento, imagenes, categorias } = product
            const totalPrice = totalCalculation(precio, impuesto, descuento, quantity) / quantity
            return {
                title: titulo,
                quantity: Number(quantity),
                price: +totalPrice,
                image: imagenes.data[0].attributes.url,
            }
        });

        const deliveryCompany = {
            title: "Envío",
            price: +deliveryPrice,
            quantity: 1,
        }
        

        try {
            const items = { cartItems, deliveryCompany };
            console.log(items);
            
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ items })
            }
            

            const TUNNER_URL = process.env.NEXT_PUBLIC_TUNNEL_URL
            const BACK_END_URL = process.env.NEXT_PUBLIC_BACKEND_URL
            const BACK_END_URL_DEV = process.env.NEXT_PUBLIC_BACKEND_DEV
            const backendUrl = process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? BACK_END_URL : BACK_END_URL_DEV
            const LOCAL_URL = "http://localhost:3000/"
            const res = await fetch(`${backendUrl}create-preference`, options)
            const preference = await res.json()
            setPreferenceId(preference.id)

        } catch (error) {
            console.error(error)
        }
    }

    return {
        mercadopagoPayment,
        preferenceId
    }
}