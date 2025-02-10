"use client";
import { Loader } from "@/components/Loader";
import { ProductCard } from "@/components/Product/ProductCard";
import { useCategories } from "@/hooks/useCategories";
import { useEffect, useState } from "react";

export default function CategoryDetail({ params }) {
    const { categoryName } = params;
    const [categorySelected, setCategorySelected] = useState(null);

    const { categories, loading, error } = useCategories();

    const findCategory = () => {
        if (categories) {
            return categories.find(
                (category) => category.attributes.slug === categoryName
            ) || null;
        }
        return null;
    };


    useEffect(() => {
        const category = findCategory();
        setCategorySelected(category);
    }, [categories, categoryName]);


    const productsRender = () => {

        if (!categorySelected) {
            return <Loader />
        }


        const { id, attributes } = categorySelected;
        const { productos } = attributes

        if (!productos || !productos.data) {
            return <p>Aún no hay productos en esta categoría</p>;
        }

        const { data } = productos;


        if (Array.isArray(data) && data.length > 0) {
            return (
                <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {
                        data.map((product) => {
                            const { titulo, stock, precio, descuento, impuesto, uuid, imagenes } = product.attributes
                            const { data: imageData } = imagenes
                            const { attributes: imageAttributes } = imageData[0]
                            const { url } = imageAttributes
                            return (
                                <ProductCard
                                    id={uuid}
                                    key={uuid}
                                    image={url}
                                    title={titulo}
                                    stock={stock}
                                    price={precio}
                                    discount={descuento}
                                    tax={impuesto}
                                />
                            )
                        }

                        )
                    }
                </ul>
            );
        }

        if (typeof data === "object" && data.attributes) {
            const { titulo, stock, precio, descuento, impuesto, uuid, imagenes } = data.attributes
            const { data: imageData } = imagenes
            const { attributes: imageAttributes } = imageData[0]
            const { url } = imageAttributes
            return (
                <ProductCard
                    key={uuid}
                    id={uuid}
                    image={url}
                    title={titulo}
                    stock={stock}
                    price={precio}
                    discount={descuento}
                    tax={impuesto}
                />
            );
        }

        return <p>Ha ocurrido un error inesperado, intenta de nuevo</p>;
    };

    if (error) {
        return <p>Ha ocurrido un error inesperado, intenta de nuevo</p>;
    }


    return (
        <>
            {
                loading ? <Loader /> : (
                    <>
                        <h2 className="font-bold text-xl">{categorySelected?.attributes.categoria}</h2>
                        <p className="text-sm text-gray-600 text-balance">{categorySelected?.attributes.descripcion}</p>
                        <section className="mt-6 flex">
                            {
                                productsRender()
                            }</section>
                    </>
                )
            }

        </>
    );
}
