export const BASE_URL =
    "https://colombiatodo-cms.onrender.com/api/categorias?populate[productos][populate][0]=imagenes&populate=imagen";

const BASE_URL_DEV = "http://localhost:1337/api/categorias?populate=*";

const BASE_URL_PORT = "https://bb19p4jm-1337.use.devtunnels.ms/api/categorias?populate=*";


export const getCategories = async () => {
    try {
        const res = await fetch(BASE_URL);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export const getCategoryByName = async (categoryName) => {
    try {
        const res = await fetch(`${BASE_URL}&filters[slug][$eq]=${categoryName}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return data.data[0];
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export async function getAllCategoriesId() {
    const response = await fetch(BASE_URL);
    const categories = await response.json();
    return categories.data.map(cat => ({
        params: {
            categoryName: cat.attributes.slug,
        },
    }));
}