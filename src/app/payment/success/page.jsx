"use client"
import { Loader } from "@/components/Loader"
import { useShippingForm } from "@/hooks/Payment/useShippingForm"
import { useAuth } from "@/hooks/useAuth"
import { useMiPaquete } from "@/hooks/useMiPaquete"
import { useOrder } from "@/hooks/useOrder"
import { useShoppingCart } from "@/hooks/useShoppingCart"
import { db } from "@/services/Firebase"
import { priceFormatter } from "@/utils/priceFormatter"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

export default function PaymentSuccess() {
    return(
        <Suspense fallback={<Loader />}>
            <PaymentSuccessContent />
        </Suspense>
    )
}

function PaymentSuccessContent() {
    const mpParams = useSearchParams()
    const { user } = useAuth()
    const {
        isLoading,
        error,
        order
    } = useOrder(mpParams)

    const {
        createSending,
        sendingId
    } = useMiPaquete()

    const {
        shippingData,
        billingData
    } = useShippingForm()

    const {
        emptyCart,
        shoppingCart
    } = useShoppingCart()


    const sendOrderMiPaquete = async () => {
        await createSending(shoppingCart, { user, shippingData }, order)
    }

    const updateProductStock = async () => {
        const { quantity, stock, strapiUUID } = shoppingCart[0]
        const bearerToken = process.env.NEXT_PUBLIC_UPDATE_PRODUCT_TOKEN
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
        const url = `${STRAPI_URL}api/productos/${strapiUUID}`
        const quantityToUpdate = +stock - +quantity
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify({
                "data": {
                    "stock": quantityToUpdate
                }
            })
        }

        try {
            const response = await fetch(url, options)
            console.log(response.json());
        } catch (error) {
            console.error(error);

        }

    }

    const saveUserOrder = async () => {
        if (!user) {
            console.error("No user is logged in");
            return;
        }

        if (!order) {
            console.error("No order received");
            return
        }

        const userOrder = {
            mpCode: sendingId.mpCode || null,
            mercadoPagoOrder: order,
            shippingData,
            createdAt: serverTimestamp()
        };

        try {
            const userRef = doc(db, "customers", user.uid);
            const ordersCollectionRef = collection(userRef, "orders");

            const newOrderRef = await addDoc(ordersCollectionRef, userOrder);

            await updateDoc(newOrderRef, {
                id: newOrderRef.id
            });

        } catch (error) {
            console.error("Error saving order: ", error);
        }
    };


    const sendOrderMail = async () => {
        if (!order) return;

        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ order, shippingData, billingData })
            }
            const BACK_END_PROD = process.env.NEXT_PUBLIC_BACKEND_URL
            const BACK_END_DEV = process.env.NEXT_PUBLIC_BACKEND_DEV
            const BACKEND_URL = process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? BACK_END_PROD : BACK_END_DEV
            const res = await fetch(`${BACKEND_URL}order`, options)
            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            const data = await res.json()
            console.log(data)
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }
    }

    useEffect(() => {
        if (order) {
            sendOrderMiPaquete()
            sendOrderMail()
        }
    }, [order])

    useEffect(() => {
        if (sendingId && order) {
            saveUserOrder()
            updateProductStock()
            emptyCart()
        }
    }, [sendingId, order])

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-lg font-semibold text-red-600">Error: {error}</h2>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center gap-2 p-6">
                <Loader /> <h2 className="text-lg">Cargando...</h2>
            </div>
        )
    }


    if (!order) {
        return (
            <div className="p-6">
                <h2 className="text-lg font-semibold">No se encontró el pedido</h2>
            </div>
        )
    }

    const { paymentId, status, statusDetail, transactionAmount, payer, paymentMethod, card, description, items, dateApproved } = order;

    const cardIcon = () => {
        switch (paymentMethod.id) {
            case "master":
                return "/icons/mc_symbol.svg"

            case "visa":
                return "/icons/visa_symbol.svg"

            case "amex":
                return "/icons/amex_symbol.svg"

            default:
                return ""
        }
    }

    return (
        <section className="flex flex-col gap-4 p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
                <p className={`px-4 py-2 text-sm rounded-2xl w-max font-semibold ${status === 'approved' ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'}`}>{status === 'approved' ? "Aprobado" : "Error"}</p>
                <p className="text-sm font-light text-center md:text-base text-gray-400"><strong>ID del Pago:</strong> {paymentId}</p>
                <p className="flex flex-col justify-end text-right text-sm">
                    <strong>{status === 'approved' ? "Aprobado" : "Error"}</strong> {new Date(dateApproved).toLocaleDateString()}
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold">Tu pago ha sido exitoso</h2>
                <p className="text-sm text-gray-500">Gracias por tu pedido, estamos procesándolo para enviártelo lo más pronto posible.</p>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="font-semibold">Resumen de pedido</h3>
                <p className="flex flex-col gap-1">
                    <span className="font-light text-sm">Total</span>
                    {priceFormatter(transactionAmount, 0, 0)[0]}
                </p>

                <div className="flex flex-col gap-1">
                    <h3 className="font-light text-sm">Detalles del Pago</h3>
                    <p className="flex gap-1 items-center">
                        <img src={cardIcon()} width="40" height="40" alt="Icono del método de pago" />
                        {paymentMethod.id} **** {card.lastFour}
                    </p>
                </div>

                <p className="flex flex-col gap-1">
                    <span className="font-light text-sm">Email Mercado Pago</span>
                    {payer.email}
                </p>

                <div className="flex flex-col gap-1">
                    <h3 className="font-light text-sm">Detalles de los Items</h3>
                    <ul className="list-disc list-inside flex flex-col gap-2">
                        {items.map((item, index) => (
                            <li key={index} className="flex gap-2 items-center">
                                <img
                                    src={item.picture_url}
                                    alt={item.title}
                                    width="40"
                                    height="40"
                                    className={item.title === "Envío" ? "hidden" : "rounded-lg shadow-sm"}
                                />
                                {
                                    item.title === "Envío" ?
                                        <span className="font-light text-sm">
                                            Envío - {priceFormatter(item.unit_price, 0, 0)[0]}
                                        </span>
                                        :
                                        <span> {item.title} - {item.quantity} x {priceFormatter(item.unit_price, 0, 0)[0]} </span>

                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
