const BASE_URL =
    "https://colombiatodo-cms.onrender.com/api/sellers?fields[0]=razonSocial&populate=logo_empresa";

const BASE_URL_DEV = "http://localhost:1337/api/sellers";

const BASE_URL_PORT = "https://bb19p4jm-1337.use.devtunnels.ms/api/sellers";

export const getBrands = async () => {
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
}