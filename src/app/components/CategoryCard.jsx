import Link from "next/link";

export function CategoryCard({ slug, categoria, imagen, productsCount, url }) {
  return (
    <Link
      key={slug}
      href={{
        pathname: `/categorias/${slug}`,
      }}
    >
      <article key={slug} className="bg-white border border-slate-100 rounded-xl flex flex-col gap-2 shadow-sm w-full hover:shadow-md hover:cursor-pointer transition-all">
        <img
          src={imagen ? url : "https://img.freepik.com/foto-gratis/ventas-cyber-monday-shopping_23-2148688502.jpg"}
          alt="Imagen de categoria"
          className="rounded-t-xl aspect-video object-cover object-center" />
        <div className="flex flex-col justify-between h-full gap-2 px-4 py-2">
          <h3 className="font-semibold text-lg truncate">{categoria}</h3>
          <div className="flex justify-between">
            <p className="bg-slate-100 font-light text-sm px-3 py-1 rounded-lg text-black">{productsCount} items </p>
          </div>
        </div>
      </article>
    </Link>
  )
}