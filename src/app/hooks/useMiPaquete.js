"use client"

import { getSellerCityCode } from "@/utils/getSellerCityCode"
import { priceCalculator } from "@/utils/priceCalculator"
import { useState } from "react"

export const useMiPaquete = () => {
    const BASE_DEV_URL = "https://api-v2.dev.mpr.mipaquete.com/"
    const BASE_PROD_URL = "https://api-v2.mpr.mipaquete.com/"
    const SESSION_TRACKER = process.env.NEXT_PUBLIC_SESSION_TRACKER
    const TEST_API_KEY = process.env.NEXT_PUBLIC_API_KEY_DEV
    const PROD_API_KEY = process.env.NEXT_PUBLIC_API_KEY_PROD

    const baseUrl =  process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? BASE_PROD_URL : BASE_DEV_URL

    const apiKey = process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? PROD_API_KEY : TEST_API_KEY

    const [sendingId, setSendingId] = useState(null)

    const getLocations = async () => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "session-tracker": SESSION_TRACKER,
                "apikey": apiKey
            }
        }
        try {
            const res = await fetch(`${baseUrl}getLocations`, options)
            const data = await res.json()
            return data
        } catch (error) {
            console.error(error);
        }
    }
    const getSpecificLocation = async (locationCode) => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "session-tracker": SESSION_TRACKER,
                "apikey": apiKey
            }
        }
        try {
            const res = await fetch(`${baseUrl}getLocations?locationCode=${locationCode}`, options)
            const data = await res.json()
            return data
        } catch (error) {
            console.error(error);
        }
    }

    const quoteShipping = async (shippingData, product) => {

        const locationsData = await getLocations()

        const body = product.map(({ precio, quantity, vendedor, dimensiones }) => {
            const { ciudad } = vendedor
            const { ancho, alto, largo, peso } = dimensiones

            const sellerCity = getSellerCityCode(locationsData, ciudad)

            const { locationCode } = sellerCity


            return ({
                "originLocationCode": locationCode, // código DANE de ciudad o municipio origen
                "destinyLocationCode": shippingData, // código DANE de ciudad o municipio destino
                "height": +alto, // alto del paquete en cm(número entero)
                "width": +ancho, // ancho del paquete  en cm (número entero)
                "length": +largo, // largo del paquete en cm(número entero)
                "weight": +peso, // peso del paquete en kg (número entero)
                "quantity": quantity, // cantidad de paquetes con la misma medida y peso
                "declaredValue": +precio, // valor declarado o valor asegurar de la unidad (cuánto cuesta producir el producto)
                "saleValue": +precio
            })
        })
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "session-tracker": SESSION_TRACKER,
                "apikey": TEST_API_KEY
            },
            body: JSON.stringify(body[0])
        }

        try {
            const res = await fetch(`${BASE_DEV_URL}quoteShipping`, options)
            const data = await res.json()
            return data
        } catch (error) {
            console.error(error);
        }
    }

    const createSending = async (sender, receiver, product) => {
        const { shippingData } = receiver
        const { name, email, address, phoneNumber, city, identification, idType } = shippingData
        const { vendedor, quantity, titulo, dimensiones, precio, impuesto, descuento } = sender[0]
        const { razonSocial, celular, direccion, email: sellerEmail, identificacion, tipoIdentificacion, ciudad } = vendedor
        const { ancho, alto, largo, peso } = dimensiones
        const locationsData = await getLocations()

        const productPrice = priceCalculator(precio, impuesto, descuento)
        const sellerCity = getSellerCityCode(locationsData, ciudad)
        const { locationCode: sellerLocationCode } = sellerCity

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "session-tracker": SESSION_TRACKER,
                "apikey": TEST_API_KEY
            },
            body: JSON.stringify({
                "sender": {
                    "name": razonSocial,
                    "surname": " ",
                    "cellPhone": celular.toString(),
                    "prefix": "+57",
                    "email": sellerEmail,
                    "pickupAddress": direccion,
                    "nit": identificacion,
                    "nitType": tipoIdentificacion
                },
                "receiver": {
                    "name": name,
                    "surname": " ",
                    "email": email,
                    "prefix": "+57",
                    "cellPhone": phoneNumber.toString(),
                    "destinationAddress": address,
                    "nit": identification,
                    "nitType": idType
                },
                "productInformation": {
                    "quantity": quantity,
                    "width": +ancho,
                    "large": +largo,
                    "height": +alto,
                    "weight": +peso,
                    "forbiddenProduct": true,
                    "productReference": titulo,
                    "declaredValue": productPrice //Valor de venta sin envío
                },
                "locate": {
                    "originDaneCode": sellerLocationCode,
                    "destinyDaneCode": city,
                    "interCode": "0"
                },
                "channel": "Colombiatodo CI SAS",
                "user": "636e50fae311dff727d2824ed",
                "deliveryCompany": " ",
                "criteria": "price",
                "description": "-",
                "comments": "-",
                "paymentType": 101, // tipo de pago 101- pago con saldo de mipaquete o 102 - Descontando el envío del recaudo realizado(aplica para 
                "valueCollection": 0, //Contraentrega ? precio con envio : 0
                "requestPickup": false,
                "adminTransactionData": {
                    "saleValue": 0 // Contraentrega ? precio producto : 0
                }
            })
        }

        try {
            const res = await fetch(`${BASE_DEV_URL}createSending`, options)
            const data = await res.json()
            console.log(data);
            setSendingId(data)
        } catch (error) {
            console.error(error);
        }
    }

    const getSendingTracking = async (mpCode) => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "session-tracker": SESSION_TRACKER,
                "apikey": TEST_API_KEY
            },
        }

        try {
            const res = await fetch(`${BASE_DEV_URL}getSendingTracking?mpCode=${mpCode}`, options)
            const data = await res.json()
            return data
        } catch (error) {
            console.error(error);
        }
    }

    return {
        getLocations,
        quoteShipping,
        createSending,
        getSendingTracking,
        sendingId,
        getSpecificLocation
    }
}