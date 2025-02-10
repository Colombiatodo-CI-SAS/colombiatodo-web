import { useContext } from "react"
import { ShoppingContext } from "@/context/Shopping/ShoppingContext"

export const useShoppingCart = () => {
    const shoppingContext = useContext(ShoppingContext)

    if (!shoppingContext) {
        throw new Error("useShoppingCart must be used within a ShoppingContextProvider")
    }

    return shoppingContext
}