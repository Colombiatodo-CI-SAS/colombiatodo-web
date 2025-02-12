import CategoryDetail from "@/components/CategoryDetail";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { getCategoryByName } from "@/services/GetCategories";

export async function generateMetadata({ params }) {
    const category = await getCategoryByName(params.categoryName);
    const { categoria, descripcion, productos } = category.attributes;
    const categoryDescription = descripcion
    const productKeywords = productos.data.map(({ attributes }) => attributes.titulo).join(", ");
    const keywords = `${categoria}, ${productKeywords}`;

    return {
        title: `${categoria} - Colombiatodo`,
        description: categoryDescription,
        keywords,
        openGraph: {
            title: categoria,
            description: categoryDescription,
        },
    };
}

export default function CategoryPage({ params }) {
    return (
        <Suspense fallback={
            <Loader />
        }>
            <CategoryDetail params={params} />
        </Suspense>
    )
}
