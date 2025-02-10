import { Loader } from "@/components/Loader";
import ProductDetail from "@/components/Product/ProductDetail";
import { Suspense } from "react";
import { getProductById } from "@/services/GetProducts";

export async function generateMetadata({ params }) {
    const product = await getProductById(params.productId);
    const { titulo, descripcion, imagenes, categorias } = product.attributes;
    const productDescription = descripcion.map(({ type, children }) => children[0].text).slice(0, 2).join(" ");
    const descriptionKeywords = productDescription.split(" ").slice(0, 10).join(", ");
    const categoryKeywords = categorias.data.map(({ attributes }) => attributes.categoria).join(", ");
    const keywords = `${categoryKeywords}, ${descriptionKeywords}`;

    return {
        title: `${titulo} - Colombiatodo`,
        description: productDescription,
        keywords,
        openGraph: {
            title: titulo,
            images: imagenes.data[0].attributes.url,
        },
    };
}

export default function ProductPage({ params }) {
    return (
        <Suspense fallback={
            <Loader />
        }>
            <ProductDetail params={params} />
        </Suspense>
    )
}