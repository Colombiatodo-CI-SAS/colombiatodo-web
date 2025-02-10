import { useEffect, useState } from "react"

export const useOrder = (mpParams) => {
    const [paymentParams, setPaymentParams] = useState({
        paymentId: null,
        status: null,
        externalReference: null,
        merchantOrderId: null,
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [order, setOrder] = useState(null)

    useEffect(() => {
        setPaymentParams({
            paymentId: mpParams.get("payment_id"),
            status: mpParams.get("status"),
            externalReference: mpParams.get("external_reference"),
            merchantOrderId: mpParams.get("merchant_order_id"),
        })
    }, [mpParams])

    useEffect(() => {
        const { paymentId } = paymentParams
        if (paymentId) {
            getPaymentHook()
        }
        return () => {
            setIsLoading(false)
            setError("No hemos encontrado el pago")
            setOrder(null)
        }

    }, [paymentParams])

    const getPaymentHook = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const { paymentId } = paymentParams
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ paymentId })
            }
            const TUNNEL_URL = process.env.NEXT_PUBLIC_TUNNEL_URL
            const BACK_END_URL = process.env.NEXT_PUBLIC_BACKEND_URL
            const BACK_TUNNEL_URL = process.env.NEXT_PUBLIC_BACKEND_DEV
            const backendUrl = process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? BACK_END_URL : BACK_TUNNEL_URL
            const res = await fetch(`${backendUrl}payment`, options)
            const data = await res.json()            
            setOrderDetails(data.data.payment)
            return data
        } catch (error) {
            console.error(error);
            setError("Hubo un error al obtener el pago")
        } finally {
            setIsLoading(false)
            setError(null)
        }
    }

    const setOrderDetails = (order) => {
        const {
            id,
            status,
            status_detail,
            transaction_amount,
            payer,
            payment_method,
            card,
            description,
            additional_info,
            date_approved,
            net_amount
        } = order;

        const orderSummary = {
            paymentId: id,
            status,
            statusDetail: status_detail,
            transactionAmount: transaction_amount,
            payer: {
                email: payer.email,
                identification: payer.identification
            },
            paymentMethod: {
                id: payment_method.id,
                type: payment_method.type
            },
            card: {
                firstSix: card.first_six_digits,
                lastFour: card.last_four_digits,
                expiration: `${card.expiration_month}/${card.expiration_year}`
            },
            description,
            items: additional_info.items,
            dateApproved: date_approved,
            netAmount: net_amount
        };

        setOrder(orderSummary)
    }

    return {
        isLoading,
        error,
        order
    }
}