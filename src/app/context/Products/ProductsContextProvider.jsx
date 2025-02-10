"use client"
import { getProducts } from "@/services/GetProducts";
import { useEffect, useState } from "react";
import { ProductsContext } from "@/context/Products/ProductsContext";

export function ProductsContextProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        getProducts().then(data => {
            setProducts(data);
        }).catch(error => {
            console.error(error);
        }).finally(() => setIsLoading(false))
    }, [])

    return (
        <ProductsContext.Provider value={{
            products,
            isLoading
        }}>
            {children}
        </ProductsContext.Provider>
    )
}