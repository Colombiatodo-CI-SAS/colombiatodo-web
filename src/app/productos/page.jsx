"use client"
import { ProductCard } from "@/components/Product/ProductCard"
import { useSearchParams } from "next/navigation"
import { useProducts } from "@/hooks/useProducts"
import { Loader } from "@/components/Loader"
import { Suspense, useState, useEffect } from "react"

export default function Products() {
    return (
        <Suspense fallback={<Loader />}>
            <ProductsContent />
        </Suspense>
    )
}

function ProductsContent() {
    const { products, isLoading } = useProducts()
    const searchParams = useSearchParams()
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [filteredProducts, setFilteredProducts] = useState([])
    const [filterValue, setFilterValue] = useState("")

    const searchQuery = searchParams.get("query") || ""

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Handle filtering with delay
    useEffect(() => {
        setLoadingSearch(true)

        const delay = setTimeout(() => {
            const formattedQuery = searchQuery.replace(/\s/g, '').toLowerCase()
            const result = !searchQuery ? products : products.filter(product => {
                const { titulo } = product.attributes
                return titulo.toLowerCase().includes(formattedQuery)
            })

            setFilteredProducts(handleFilteredProducts(result))
            setLoadingSearch(false)
        }, 500) // Delay in milliseconds

        return () => clearTimeout(delay)
    }, [searchQuery, products, filterValue])

    const handleFilter = (e) => {
        const { value } = e.target
        setFilterValue(value)
    }

    const handleFilteredProducts = (productsArray) => {
        switch (filterValue) {
            case "recents":
                return productsArray.sort((a, b) => new Date(b.attributes.publishedAt) - new Date(a.attributes.publishedAt))
            case "low-price":
                return productsArray.sort((a, b) => a.attributes.precio - b.attributes.precio)
            case "high-price":
                return productsArray.sort((a, b) => b.attributes.precio - a.attributes.precio)
            default:
                return productsArray
        }
    }

    return (
        <section className="mt-8 flex flex-col gap-3 lg:gap-4 lg:mt-16 lg:w-full">
            <select
                name="filter"
                id="filter"
                onChange={handleFilter}
                className="p-3 border border-gray-300 rounded-xl text-sm text-gray-600">
                <option value="">Filtrar por:</option>
                <option value="recents">Más recientes</option>
                <option value="low-price">Precio: menor a mayor</option>
                <option value="high-price">Precio: mayor a menor</option>
            </select>
            <ProductsSection
                products={filteredProducts}
                query={searchQuery}
                loading={isLoading || loadingSearch}
            />
        </section>
    )
}

function ProductsSection({ products, query, loading }) {
    const queryValidation = products?.length > 0

    if (loading) {
        return (
            <Loader />
        )
    }

    if (!queryValidation && query) {
        return <p>No se han encontrado resultados para: <strong>{query}</strong></p>
    }

    return (
        <>
            {query && products && <p className="text-sm">Resultados para: &quot;{query}&quot;</p>}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {products?.map((product) => {
                    const { uuid, titulo, precio, imagenes, stock, descuento, impuesto } = product.attributes
                    return (
                        <ProductCard
                            key={uuid}
                            id={uuid}
                            title={titulo}
                            price={precio}
                            image={imagenes.data[0].attributes.url}
                            tax={impuesto}
                            discount={descuento}
                            stock={stock}
                        />
                    )
                })}
            </div>
        </>
    )
}
