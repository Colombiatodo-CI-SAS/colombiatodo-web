/* eslint-disable @next/next/no-img-element */
"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { Button } from "@/components/Button";
import { priceFormatter } from "@/utils/priceFormatter";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import Link from "next/link";
import { ProductImageSelector } from "./ProductImageSelector";

export default function ProductDetail({ info }) {
    const [seeMore, setSeeMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImg, setSelectedImg] = useState(null);
    const [continueShopping, setContinueShopping] = useState(false);

    const shoppingCart = useShoppingCart();
    const { hideToast } = useToast();
    const { handleAddItem, isLoading, error: cartError, toast } = shoppingCart;
    const router = useRouter();

    const toggleSeeMore = () => {
        setSeeMore(prevState => !prevState);
    };

    const selectProductSize = (e) => {
        const { value } = e.target;
        setSelectedSize(value);
    };

    const handleImgClick = (id) => {
        setSelectedImg(id);
    };

    useEffect(() => {
        hideToast();
    }, []);

    useEffect(() => {
        let loadingTimeout = setTimeout(() => {
            setLoading(false);
        }, 500)

        return () => {
            clearTimeout(loadingTimeout);
        }
    }, [])

    useEffect(() => {
        if (info && info.attributes.imagenes.data.length > 0) {
            setSelectedImg(info.attributes.imagenes.data[0].id);
        }
    }, [info]);

    if (loading) {
        return <Loader />;
    }

    if (!info) {
        return (
            <div className="flex flex-col items-center justify-center mx-auto gap-3 w-1/2 h-[30dvh]">
                <p className="text-lg">Hubo un error cargando el producto, intenta de nuevo</p>
                <Button action={goBack} className="mt-4">
                    Volver
                </Button>
            </div>
        );
    }

    const { uuid, titulo, precio, imagenes, stock, descuento, impuesto, descripcion, categorias, seller, tallas_disponibles, especificaciones } = info.attributes;
    const { razonSocial } = seller.data.attributes;
    const { data } = categorias;

    const renderDescription = (description) => {
        const maxHeight = seeMore ? "none" : "200px";
        return (
            <div
                className={`overflow-hidden transition-all duration-300 relative`}
                style={{ maxHeight }}
            >
                <div className="space-y-2">
                    {description.map((item) => {
                        if (item.type === "paragraph") {
                            return item.children.map((child) => (
                                <p key={crypto.randomUUID()} className="text-sm text-gray-600">
                                    {child.text}
                                </p>
                            ));
                        } else if (item.type === "list") {
                            return (
                                <ul key={crypto.randomUUID()} className="list-disc pl-5 text-sm text-gray-600">
                                    {item.children.map((listItem) => (
                                        <li key={crypto.randomUUID()}>
                                            {listItem.children[0].text}
                                        </li>
                                    ))}
                                </ul>
                            );
                        }
                        return null;
                    })}
                </div>
                {!seeMore && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                )}
            </div>
        );
    };

    const productDescription = renderDescription(descripcion);

    function goBack() {
        router.back();
    };

    const priceFormatted = priceFormatter(precio, impuesto, descuento);
    const [priceWithDiscount, basePrice] = priceFormatted;

    return (
        <>
            {toast.isVisible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
            <section id={uuid} className="flex flex-col gap-3 md:flex-row md:gap-24">
                <ArrowLeft onClick={goBack} className="block md:hidden" />
                <ProductImageSelector
                    imagenes={imagenes}
                    selectedImg={selectedImg}
                    handleImgClick={handleImgClick}
                    titulo={titulo}
                />

                <div className="flex flex-col justify-between gap-4 lg:gap-2 w-full">
                    <section className="flex">
                        {data.map(({ attributes }) => {
                            const { categoria } = attributes;
                            return (
                                <p key={categoria} className="text-sm bg-gray-100 py-1 px-4 w-max rounded-2xl font-light">{categoria}</p>
                            );
                        })}
                    </section>
                    <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 lg:justify-between lg:items-center">
                        <div>
                            <h2 className="font-bold text-xl lg:text-xl">{titulo}</h2>
                            <h4 className="font-light text-gray-400">Vendido por: <span className="font-medium cursor-pointer">{razonSocial}</span></h4>
                        </div>
                        <div className="flex flex-col">
                            {!descuento ? (
                                <p className="text-lg md:text-right lg:text-base">{basePrice}</p>
                            ) : (
                                <p className="text-xs lg:text-base flex items-center justify-end gap-2">
                                    <span className="flex flex-col">
                                        <span className="font-bold no-underline">{priceWithDiscount}</span>
                                        <span className="line-through text-sm text-gray-400">{basePrice}</span>
                                    </span>
                                    <span className="bg-green-500 text-white px-1 py-1 rounded-md">%{descuento}</span>
                                </p>
                            )}
                            {
                                stock > 0
                                    ? <p className="font-light text-gray-400 lg:text-right">{stock} unidades disponibles</p>
                                    : <p className="text-red-500 text-sm lg:text-base lg:text-right">Agotado</p>
                            }

                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {productDescription}
                        <button
                            onClick={toggleSeeMore}
                            className="text-blue-500 hover:text-blue-700 text-sm font-medium self-start"
                        >
                            {seeMore ? "Ver menos" : "Ver más"}
                        </button>
                    </div>

                    {tallas_disponibles.length > 0 && (
                        <section className="flex flex-col gap-3 mb-6">
                            <h3 className="font-semibold text-lg lg:text-xl">Tallas disponibles</h3>
                            <div className="flex flex-wrap gap-2">
                                {tallas_disponibles.map(({ talla, stock }) => (
                                    <label htmlFor={`talla-${talla}`} key={talla}>
                                        <input
                                            type="radio"
                                            id={`talla-${talla}`}
                                            name="talla"
                                            className="peer hidden"
                                            aria-label={`Seleccionar talla ${talla}`}
                                            value={talla}
                                            checked={selectedSize === talla}
                                            onChange={(e) => selectProductSize(e)}
                                        />
                                        <span className="flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-500 peer-checked:text-white">
                                            {talla}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    )}

                    <fieldset className="flex flex-col gap-3 items-center">
                        <Button
                            action={() => {
                                handleAddItem(info, selectedSize);
                                setContinueShopping(prevState => !prevState);
                            }}
                            loading={isLoading}
                            error={cartError}
                            disabled={stock === 0}
                        >
                            {
                                stock === 0
                                    ? "Agotado"
                                    : "Añadir al carrito"

                            }
                        </Button>
                        {continueShopping && (
                            <Link href={"/productos"} className="text-xs md:text-base text-blue-500 hover:text-blue-700 cursor-pointer">
                                Seguir comprando
                            </Link>
                        )}
                    </fieldset>
                </div>
            </section>
            {especificaciones.length > 0 && (
                <section className="mt-8 flex flex-col gap-4">
                    <div>
                        <h3 className="font-semibold text-lg">Especificaciones</h3>
                        <hr className="border-black" />
                    </div>
                    <table>
                        <tbody>
                            {especificaciones.map((specs, index) => {
                                const { id, titulo, description } = specs;
                                const isEven = index % 2 === 0;
                                const bgColor = isEven ? "bg-gray-200" : "bg-transparent";
                                return (
                                    <tr key={id} className={`${bgColor} grid grid-cols-2 w-full items-center p-2`}>
                                        <td className="font-medium">{titulo}</td>
                                        <td className="break-words">{description}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            )}
        </>
    );
}