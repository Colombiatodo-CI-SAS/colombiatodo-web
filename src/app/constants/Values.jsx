import { ShieldCheck, Earth, ShoppingBag } from "lucide-react";

export const VALUES = [
    {
        id: 1,
        title: "Un mundo de posibilidades",
        content: "Miles de productos de diferentes proveedores en un solo lugar",
        icon: <Earth className="w-12" width={48} height={48} />
    },
    {
        id: 2,
        title: "Transacciones seguras y transparentes",
        content: "Seguridad en métodos de pago y seguimiento de productos",
        icon: <ShieldCheck className="w-12" width={48} height={48} />
    },
    {
        id: 3,
        title: "Agiliza tus compras B2C/B2B",
        content: "Compras en línea 24/7, cotizaciones al instante",
        icon: <ShoppingBag className="w-12" width={48} height={48} />
    },
]