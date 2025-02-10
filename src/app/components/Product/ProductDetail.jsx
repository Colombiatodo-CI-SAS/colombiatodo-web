/* eslint-disable @next/next/no-img-element */
"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { Button } from "@/components/Button";
import { priceFormatter } from "@/utils/priceFormatter";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import Link from "next/link";

export default function ProductDetail({ params }) {
    const [seeMore, setSeeMore] = useState(false)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedImg, setSelectedImg] = useState(null)
    const [continueShopping, setContinueShopping] = useState(false)

    const shoppingCart = useShoppingCart()
    const { products } = useProducts()
    const { hideToast } = useToast()
    const { handleAddItem, isLoading, error: cartError, toast } = shoppingCart
    const router = useRouter()

    const { productId, strapiID } = params

    const toggleSeeMore = () => {
        setSeeMore(prevState => !prevState)
    }

    const selectProductSize = () => {
        const { target } = e
        const { value } = target
        setSelectedSize(value)
    }


    const handleImgClick = (id) => {
        setSelectedImg(id)
    }


    const characterLimit = 300


    const findProduct = () => {
        if (products) {
            return products.find(product => product.attributes.uuid === productId) || null
        }
        return null
    }

    useEffect(() => {
        hideToast()
    }, [])

    useEffect(() => {
        const product = findProduct()
        setProduct(product)
    }, [products, findProduct])

    useEffect(() => {
        if (product && product.attributes.imagenes.data.length > 0) {
            setSelectedImg(product.attributes.imagenes.data[0].id);
        }
    }, [product]);



    if (loading) {
        return <Loader />
    }

    if (!product) {
        return <p>{error}</p>
    }

    const { uuid, titulo, precio, imagenes, stock, descuento, impuesto, descripcion, categorias, seller, tallas_disponibles, especificaciones } = product.attributes
    const { razonSocial } = seller.data.attributes
    const { data } = categorias

    const productDescription = descripcion.map(({ type, children }) => {
        const { text } = children[0]
        return <p key={crypto.randomUUID()}>{text}</p>
    })


    const goBack = () => {
        router.back()
    }

    const priceFormatted = priceFormatter(precio, impuesto, descuento)
    const [priceWithDiscount, basePrice] = priceFormatted


    return (
        <>
            {
                toast.isVisible && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )
            }
            <section id={uuid} className="flex flex-col gap-3 md:flex-row md:gap-24">
                <ArrowLeft onClick={goBack} className="block md:hidden" />
                <div className="flex flex-col-reverse lg:flex-row gap-3 w-full lg:w-full">
                    {
                        imagenes.data.length > 0 && (
                            <div className="flex flex-row lg:flex-col h-full overflow-y-auto gap-2">
                                {
                                    imagenes.data.map(({ id, attributes }) => {
                                        const { url } = attributes
                                        return (
                                            <img
                                                key={crypto.randomUUID()}
                                                alt={`Imagen de ${titulo} producto`}
                                                src={url}
                                                loading="lazy"
                                                width={200}
                                                height={200}
                                                decoding="async"
                                                className={`w-[100px] h-[100px] object-cover lg:w-[100px] lg:h-[100px] aspect-square rounded-md shadow-sm border border-gray-300 hover:opacity-100 hover:border-gray-400 cursor-pointer transition-all ${selectedImg === id ? "opacity-100 border-gray-400 border-2" : "opacity-70"}`}
                                                onClick={() => handleImgClick(id)}
                                            />
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                    {
                        imagenes.data.filter(({ id }) => id === selectedImg).map(({ attributes }) => {
                            const { url } = attributes
                            return (
                                <img
                                    key={crypto.randomUUID()}
                                    alt={`Imagen de ${titulo} producto`}
                                    src={url || imagenes.data[0].attributes.url}
                                    loading="lazy"
                                    width={450}
                                    height={450}
                                    decoding="async"
                                    className="w-full h-[200px] object-cover md:w-[450px] md:h-[450px] aspect-square rounded-md shadow-sm border border-gray-300" />
                            )
                        })
                    }
                </div>

                <div className="flex flex-col justify-between gap-4 lg:gap-2 w-full">
                    <section className="flex">
                        {
                            data.map(({ attributes }) => {
                                const { id, categoria } = attributes
                                return (
                                    <p key={categoria} className="text-sm bg-gray-100 py-1 px-4 w-max rounded-2xl font-light">{categoria}</p>
                                )
                            })
                        }
                    </section>
                    <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 lg:justify-between lg:items-center">
                        <div>
                            <h2 className="font-bold text-xl lg:text-xl">{titulo}</h2>
                            <h4 className="font-light text-gray-400">Vendido por: <span className="font-medium cursor-pointer">{razonSocial}</span></h4>
                        </div>
                        <div className="flex flex-col">
                            {
                                !descuento
                                    ?
                                    <p
                                        className="text-lg md:text-right lg:text-base">{basePrice}</p>
                                    :
                                    <p
                                        className="text-xs lg:text-base flex items-center justify-end gap-2">
                                        <span className="flex flex-col">
                                            <span
                                                className="font-bold no-underline">
                                                {priceWithDiscount}
                                            </span>

                                            <span
                                                className="line-through text-sm text-gray-400">
                                                {basePrice}
                                            </span>
                                        </span>
                                        <span className="bg-green-500 text-white px-1 py-1 rounded-md">
                                            %{descuento}
                                        </span>
                                    </p>
                            }
                            <p className="font-light text-gray-400 lg:text-right">{stock} unidades disponibles</p>
                        </div>
                    </div>
                    <div>
                        {
                            seeMore ? productDescription : productDescription.slice(0, 4)
                        }
                        {
                            seeMore
                                ?
                                <button
                                    onClick={toggleSeeMore}
                                    className="text-blue-500 font-light">
                                    Ver menos
                                </button>
                                :
                                <button
                                    onClick={toggleSeeMore}
                                    className="text-blue-500 font-light">
                                    Ver más
                                </button>
                        }
                    </div>

                    {
                        tallas_disponibles.length > 0 &&
                        <section className="flex flex-col gap-3 mb-6">
                            <h3 className="font-semibold text-lg lg:text-xl">Tallas disponibles</h3>
                            <div className="flex flex-wrap gap-2">
                                {
                                    tallas_disponibles.map(({ talla, stock }) => {
                                        return (
                                            <label htmlFor={`talla-${talla}`} key={talla}>
                                                <input
                                                    type="radio"
                                                    id={`talla-${talla}`}
                                                    name="talla"
                                                    className="peer hidden"
                                                    aria-label={`Seleccionar talla ${talla}`}
                                                    value={talla}
                                                    checked={selectedSize === talla}
                                                    onChange={(e) => selectProductSize(e)} />
                                                <span className="flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-500 peer-checked:text-white">
                                                    {talla}
                                                </span>
                                            </label>
                                        )
                                    })
                                }
                            </div>
                        </section>
                    }

                    <fieldset className="flex flex-col gap-3 items-center">
                        <Button
                            action={() => {
                                handleAddItem(product, selectedSize)
                                setContinueShopping(prevState => !prevState)
                            }}
                            loading={isLoading}
                            error={cartError}
                        >
                            Añadir al carrito
                        </Button>
                        {
                            continueShopping && (
                                <Link
                                    href={"/productos"}
                                    className="text-xs md:text-base text-blue-500 hover:text-blue-700 cursor-pointer"
                                >
                                    Seguir comprando
                                </Link>
                            )
                        }

                    </fieldset>
                </div>
            </section>
            {
                especificaciones.length > 0 && (
                    <section className="mt-8 flex flex-col gap-4">
                        <div>
                            <h3 className="font-semibold text-lg">Especificaciones</h3>
                            <hr className="border-black" />
                        </div>
                        <table>
                            <tbody>
                                {
                                    especificaciones.map((specs, index) => {
                                        const { id, titulo, description } = specs
                                        const isEven = index % 2 === 0
                                        const bgColor = isEven ? "bg-gray-200" : "bg-transparent"
                                        return (
                                            <tr key={id} className={`${bgColor} grid grid-cols-2 w-full items-center p-2`}>
                                                <td className="font-medium">{titulo}</td>
                                                <td className="break-words">{description}</td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>
                    </section>
                )
            }

        </>
    )
}