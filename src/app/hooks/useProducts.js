import { ProductsContext } from "@/context/Products/ProductsContext"
import { useContext } from "react"

export const useProducts = () => {
    const productsContext = useContext(ProductsContext)

    if (!productsContext) {
        throw new Error("useProducts must be used within a ProductsContextProvider")
    }

    return productsContext
}
