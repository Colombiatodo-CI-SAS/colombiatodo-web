import { MercadoPagoConfig } from "mercadopago";

export const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN });
