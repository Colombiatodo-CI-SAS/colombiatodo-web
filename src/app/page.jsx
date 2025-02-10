"use client"
import { Subtitle } from "@/components/Subtitle";
import { ProductCard } from "@/components/Product/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { useProducts } from "@/hooks/useProducts";
import { Loader } from "@/components/Loader";
import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import { useBrands } from "@/hooks/useBrands";
import { BANNERS } from "@/constants/banners";


export default function Home() {

  const { products, isLoading } = useProducts()
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const { brands, isLoading: isLoadingBrands } = useBrands()
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const [responsiveBannerSrc, setResponsiveBannerSrc] = useState("")

  const categoriesSort = categories?.sort((a, b) => {
    const aLength = a.attributes.productos?.data?.length || 0;
    const bLength = b.attributes.productos?.data?.length || 0;
    return bLength - aLength;
  })


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => {
        if (prev === BANNERS.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const responsiveBannerSrc = responsiveBanner()
    setResponsiveBannerSrc(responsiveBannerSrc)
  }, [])


  function responsiveBanner() {
    if (window.innerWidth < 460) {
      return BANNERS[currentImgIndex].images[1].src
    } else {
      return BANNERS[currentImgIndex].images[0].src
    }
  }

  const activeImage = BANNERS[currentImgIndex]

  return (
    <>
      <main className="relative flex flex-col items-center gap-4 lg:gap-12 mt-24 lg:mt-44">
        <img
          src={responsiveBannerSrc}
          alt={activeImage.metadata.alt}
          title={activeImage.metadata.title}
          width={1232}
          height={390}
          className="w-full h-full rounded-xl transition-all"
        />
        <div className="flex flex-col gap-4 lg:gap-6">
          <Subtitle>Categorías</Subtitle>
          <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {
              categories && !isLoadingCategories ? (
                categoriesSort.map((category) => {
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
                      imagen={imagen}
                      url={url}
                      categoria={categoria}
                      slug={slug}
                      key={id}
                      productsCount={productsCount}
                    />

                  )
                })

              ) :
                <Loader />
            }
          </section>
          <Link href={"/categorias"} className="w-full text-center text-base md:text-sm text-blue-500 hover:text-blue-700 cursor-pointer">
            Ver más
          </Link>
        </div>
        <ScrollSection>
          <Subtitle>Productos populares / tendencias</Subtitle>
          <ProductsSection products={products} loading={isLoading} />
          <Link href={"/productos"} className="w-full text-center text-base md:text-sm text-blue-500 hover:text-blue-700 cursor-pointer">
            Ver más
          </Link>
        </ScrollSection>

        <section className="w-full flex flex-col gap-8">
          <div>
            <Subtitle>Nuestros proveedores</Subtitle>
            <p className="text-center w-fit mx-auto">La mejor calidad a un click de distancia</p>
          </div>

          <div className="w-1/2 inline-flex mx-auto flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
            <ul
              className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
            >
              {
                brands && !isLoadingBrands ? (
                  brands.length <= 1 ?
                    <>
                      <li>
                        <img
                          src="/images/logo_colombiatodo.webp"
                          alt="Logo Colombiatodo"
                          width={144}
                          height={144}
                          title="Colombiatodo CI SAS"
                        />
                      </li>
                      <li>
                        <img
                          src="/images/logo_colombiatodo.webp"
                          alt="Logo Colombiatodo"
                          width={144}
                          height={144}
                          title="Colombiatodo CI SAS"
                        />
                      </li>

                    </>
                    :
                    brands.map(({ id, attributes }) => {
                      const { razonSocial, logo_empresa } = attributes
                      const { data } = logo_empresa
                      if (!data) {
                        return
                      }
                      return (
                        <img
                          key={id}
                          src=""
                          alt={razonSocial}
                          title={razonSocial}
                          loading="lazy"
                          className="mx-4 inline h-16"
                        />
                      )
                    })
                ) : <Loader />
              }
            </ul>
            <ul
              className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
              aria-hidden="true"
            >
              <li>
                <img
                  src="/images/logo_colombiatodo.webp"
                  alt="Logo Colombiatodo"
                  width={144}
                  height={144}
                  title="Colombiatodo CI SAS"
                />
              </li>
              <li>
                <img
                  src="/images/logo_colombiatodo.webp"
                  alt="Logo Colombiatodo"
                  width={144}
                  height={144}
                  title="Colombiatodo CI SAS"
                />
              </li>
            </ul>
          </div>
        </section>

      </main>
    </>
  );
}

function ScrollSection({ children }) {
  return (
    <section className="w-full overflow-hidden flex flex-col gap-4 lg:gap-0">
      {children}
    </section>
  )
}

function ProductsSection({ products, loading }) {

  return (
    <section className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth lg:gap-6 p-4 justify-start lg:justify-around">
      {
        products && !loading ?
          products.slice(0, 4).map((product) => {
            const { uuid, titulo, precio, imagenes, stock, descuento, impuesto } = product.attributes
            return <ProductCard
              key={uuid}
              id={uuid}
              title={titulo}
              price={precio}
              image={imagenes.data[0].attributes.url}
              stock={stock}
              discount={descuento}
              tax={impuesto} />
          })
          :
          <Loader />
      }
    </section>
  )
}






