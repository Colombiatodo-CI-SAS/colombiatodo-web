"use client"

import { X } from "lucide-react"

export default function ProductSummary({ uuid, imagenes, titulo, stock, quantity, priceWithDiscount, priceFormatted, basePrice, descuento, talla, handleProductQuantity, handleQuantityChange, deleteItem }) {
    return (
        <article key={uuid} className="flex justify-between items-center gap-3 py-3 border-b border-gray-300">
            <div className="flex items-center gap-2">
                <img
                    alt={`Imagen de ${titulo} producto`}
                    src={imagenes.data[0].attributes.url}
                    loading="lazy"
                    width={100}
                    height={100}
                    decoding="async"
                    className="w-[60px] h-[60px] object-cover lg:w-[75px] lg:h-[75px] aspect-square rounded-md" />
                <div className="flex flex-col gap-0.5">
                    <h3 className="font-bold text-sm md:text-base">{titulo}</h3>
                    {
                        talla && (
                            <p className="font-light">Talla: {talla}</p>
                        )
                    }
                    <div className="flex w-max border border-gray-300 rounded-md justify-between divide-gray-300">
                        <input
                            type="button"
                            value="-"
                            className="text-center cursor-pointer px-3 lg:px-0 bg-gray-200 md:w-6"
                            onClick={e => quantity > 1 ? handleQuantityChange(e, uuid) : null} />
                        <input
                            className="text-center w-6"
                            onChange={e => handleProductQuantity(e, uuid)}
                            value={(quantity > stock) ? stock : quantity < 1 ? 0 : quantity} />
                        <input
                            type="button"
                            value="+"
                            className="text-center cursor-pointer px-3 lg:px-0 bg-gray-200 md:w-6"
                            onClick={e => quantity < stock ? handleQuantityChange(e, uuid) : null} />
                    </div>
                    {
                        quantity === stock ?
                            <p className="text-xs text-gray-400">No hay más productos en stock</p>
                            :
                            null
                    }
                </div>
            </div>
            <div className="flex gap-2 items-center">

                {
                    descuento > 0 ? (
                        <p className="text-xs flex flex-col md:text-sm">
                            <span className="font-semibold">
                                {priceWithDiscount}
                            </span>
                            <span className="text-gray-400 line-through">
                                {basePrice}
                            </span>
                        </p>
                    ) : (
                        <p className="text-xs md:text-sm">
                            {priceFormatted[0]}
                        </p>
                    )
                }
                <X
                    onClick={() => deleteItem(uuid)}
                    color="#FF0000"
                    className="cursor-pointer w-5 md:w-6"
                />
            </div>
        </article>
    )
}