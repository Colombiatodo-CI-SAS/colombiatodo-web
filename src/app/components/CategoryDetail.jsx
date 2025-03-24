"use client";
import { Loader } from "@/components/Loader";
import { ProductCard } from "@/components/Product/ProductCard";

export default function CategoryDetail({ info }) {
    // Usa directamente la categoría pasada desde el servidor
    const categorySelected = info;

    if (!categorySelected) {
        return <Loader />;
    }

    const { productos, categoria, descripcion } = categorySelected.attributes;

    const productsRender = () => {
        if (!productos || !productos.data) {
            return <p>Aún no hay productos en esta categoría</p>;
        }

        const { data } = productos;

        if (Array.isArray(data) && data.length > 0) {
            return (
                <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {data.map((product) => {
                        const {
                            titulo,
                            stock,
                            precio,
                            descuento,
                            impuesto,
                            uuid,
                            imagenes,
                        } = product.attributes;
                        const { data: imageData } = imagenes;
                        const { attributes: imageAttributes } = imageData[0];
                        const { url } = imageAttributes;
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
                        );
                    })}
                </ul>
            );
        }

        // Si productos es un objeto único (no array)
        if (typeof data === "object" && data.attributes) {
            const {
                titulo,
                stock,
                precio,
                descuento,
                impuesto,
                uuid,
                imagenes,
            } = data.attributes;
            const { data: imageData } = imagenes;
            const { attributes: imageAttributes } = imageData[0];
            const { url } = imageAttributes;
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

    return (
        <>
            <h3 className="font-bold text-xl">{categoria}</h3>
            <p className="text-sm text-gray-600 text-balance">
                {descripcion}
            </p>
            <section className="mt-6 flex">{productsRender()}</section>
        </>
    );
}
