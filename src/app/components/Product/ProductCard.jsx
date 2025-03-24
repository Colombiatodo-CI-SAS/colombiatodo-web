/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { priceFormatter } from "@/utils/priceFormatter";


export function ProductCard({ id, title, image, price, stock, tax, discount, onClick }) {

  const prices = priceFormatter(price, tax, discount)
  const [priceWithDiscount, basePrice] = prices
  const withDiscount = discount > 0

  return (
    <Link
      href={{
        pathname: `/productos/${id}`,
      }}
      title={`Producto ${title}`}
    >
      <article className="shrink-0 snap-center origin-center scale-100 relative p-2 shadow-sm border border-gray-300 rounded-lg flex flex-col items-center sm:items-start gap-2 w-40 sm:w-48 md:w-52 lg:w-68 h-auto cursor-pointer hover:scale-105 transition-transform lg:shrink"
        onClick={onClick}
      >
        <img
          alt={`Imagen de ${title} producto`}
          title={`Imagen de ${title} producto`}
          src={image}
          loading="lazy"
          width={260}
          height={260}
          decoding="async"
          className="w-[120px] h-[120px] object-cover md:w-[260px] md:h-[260px] lg:w-full rounded-md aspect-square" />
        <span className="flex flex-col gap-1 w-full lg:flex-row lg:justify-between">
          <h3 className="font-bold truncate text-sm w-full md:w-4/5 lg:text-base">{title}</h3>
          <p className="text-xs flex items-center">
            Stock: {stock}
          </p>
        </span>
        <span>
          {
            !withDiscount
              ?
              <p
                className="text-xs lg:text-sm">{basePrice}</p>
              :
              <p
                className="text-xs lg:text-sm flex flex-row-reverse items-center gap-1">
                <span
                  className="line-through">
                  {basePrice}
                </span>

                <span
                  className="font-bold no-underline flex justify-between items-center">
                  {priceWithDiscount} <span className="bg-green-500 text-white px-1 py-1 rounded-md absolute top-2 right-2">
                    %{discount}
                  </span>
                </span>

              </p>
          }

        </span>
      </article>
    </Link>
  )
}