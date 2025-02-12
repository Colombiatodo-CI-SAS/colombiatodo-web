import CategoryDetail from "@/components/CategoryDetail";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { getAllCategoriesId, getCategoryByName } from "@/services/GetCategories";

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

export async function generateStaticParams() {
    const paths = await getAllCategoriesId();
    return paths;
}

export default async function CategoryPage({ params }) {
    const category = await getCategoryByName(params.categoryName);
    return (
        <Suspense fallback={<Loader />}>
            <CategoryDetail info={category} />
        </Suspense>
    );
}
