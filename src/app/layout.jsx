import { Inter } from "next/font/google"
import "@/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShoppingContextProvider } from "@/context/Shopping/ShoppingContextProvider";
import { AuthContextProvider } from "@/context/Auth/AuthContextProvider";
import { ProductsContextProvider } from "@/context/Products/ProductsContextProvider";
import { FloatingButton } from "@/components/FloatingButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Colombiatodo CI SAS",
  description: "Colombiatodo, opciones y soluciones. Somos tu tienda online, donde podrás encontrar variedad de opciones para ti o tu negocio.",
  keywords: "tienda online, productos, soluciones, negocio, colombiatodo, compras, ecommerce",
  author: "Colombiatodo CI SAS",
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthContextProvider>
          <ProductsContextProvider>
            <ShoppingContextProvider>
              <Header />
              <main className="px-7 mt-24 md:mt-44 md:px-9 lg:px-28">
                {children}
                <FloatingButton
                  icon={"/icons/whatsapp-icon.svg"}
                />
              </main>
            </ShoppingContextProvider>
          </ProductsContextProvider>
        </AuthContextProvider>
        <Footer />
      </body>
    </html >
  );
}
