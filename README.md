# Colombiatodo Web

Este es un proyecto de [Next.js](https://nextjs.org/) creado con [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
- [Variables de Entorno](#variables-de-entorno)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Descripción

Colombiatodo Web es una plataforma de comercio electrónico que permite a los usuarios explorar y comprar productos de diversas categorías.

## Características

- Listado de productos y categorías.
- Detalles del producto.
- Banners responsivos.
- Integración con proveedores.
- Soporte para múltiples marcas.

## Instalación

Primero, clona el repositorio:

```bash
git clone https://github.com/tu-usuario/colombiatodo-web.git
cd colombiatodo-web
```

Luego, instala las dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
```

Finalmente, inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

## Variables de Entorno

Configura las siguientes variables de entorno en un archivo `.env` en la raíz del proyecto:

```env
NEXT_PUBLIC_ENVIRONMENT = "development"

#SUPABASE
NEXT_PUBLIC_SUPABASE_URL = 
NEXT_PUBLIC_SUPABASE_KEY = 

#MIPAQUETE
NEXT_PUBLIC_SESSION_TRACKER = 
NEXT_PUBLIC_API_KEY_PROD = 
NEXT_PUBLIC_API_KEY_DEV  = 

#Firebase keys
NEXT_PUBLIC_FIREBASE_API_KEY = 
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 
NEXT_PUBLIC_FIREBASE_PROJECT_ID = 
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 
NEXT_PUBLIC_FIREBASE_APP_ID = 

#Mercado pago keys
NEXT_PUBLIC_MERCADO_PAGO_DEV = 
NEXT_PUBLIC_MERCADO_PAGO_PRODUCTION_PUBLIC_KEY = 
NEXT_PUBLIC_CLIENT_SECRET = 
vendedor = 
password_vendedor = 
comprador = TESTUSER694831332
password_comprador = kYieanE7Ct
mastercard = 5120 6944 7061 6271
vence = 11/25

#Strapi
NEXT_PUBLIC_UPDATE_PRODUCT_TOKEN = 
NEXT_PUBLIC_API_URL = 

#TUNNEL_PORTS
NEXT_PUBLIC_TUNNEL_URL =
```

Esta estructura cubre los aspectos esenciales de tu proyecto y proporciona una guía clara para los desarrolladores que deseen contribuir o desplegar la aplicación.
