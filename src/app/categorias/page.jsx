"use client"
import { CategoryCard } from "@/components/CategoryCard"
import { Loader } from "@/components/Loader"
import { useCategories } from "@/hooks/useCategories"
import { useEffect } from "react"


export default function Categorias() {

    const { categories, isLoading } = useCategories()


    const categoriesSort = categories?.sort((a, b) => {
        const aLength = a.attributes.productos?.data?.length || 0;
        const bLength = b.attributes.productos?.data?.length || 0;
        return bLength - aLength;
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <>
            <h2 className="font-bold text-xl">Categorías</h2>
            {
                isLoading ? <Loader /> :
                    (
                        <>

                            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                                {
                                    categoriesSort?.map((category) => {
                                        const { id, attributes } = category
                                        const { categoria, descripcion, productos, slug, imagen } = attributes
                                        const { data } = productos || []
                                        const { data: imagenData } = imagen
                                        const { attributes: imagenAttributes } = imagenData
                                        const { url } = imagenAttributes



                                        const dataCount = () => {
                                            if (!data) {
                                                return 0;
                                            }

                                            if (Array.isArray(data)) {
                                                return data.length;
                                            }

                                            if (typeof data === "object") {
                                                return 1;
                                            }

                                            return 0;
                                        };

                                        const productsCount = dataCount()

                                        return (
                                            <CategoryCard
                                                slug={slug}
                                                key={id}
                                                imagen={imagen}
                                                url={url}
                                                categoria={categoria}
                                                productsCount={productsCount}
                                            />
                                        )
                                    })
                                }

                            </section>
                        </>
                    )
            }

        </>
    )
}