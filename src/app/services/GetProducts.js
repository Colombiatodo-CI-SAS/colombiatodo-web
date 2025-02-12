const BASE_URL =
  "https://colombiatodo-cms.onrender.com/api/productos?populate=seller&populate=imagenes&populate=categorias&populate=tallas_disponibles&populate=dimensiones_producto&populate=dimensiones_empaque&populate=especificaciones";

const BASE_URL_DEV = "http://localhost:1337/api/productos?populate=*";

const BASE_URL_PORT = "https://bb19p4jm-1337.use.devtunnels.ms/api/productos?populate=seller&populate=imagenes&populate=categoria&populate=tallas_disponibles&populate=dimensiones_empaque";

export const getProducts = async () => {
  try {
    let page = 1
    let pageSize = 20
    let allProducts = [];
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(`${BASE_URL}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      allProducts = [...allProducts, ...data.data];
      const { pageCount } = data.meta.pagination
      hasMore = page < pageCount
      page++
    }
    return allProducts;

  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}&filters[uuid][$eq]=${productId}`);
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

export async function getAllProductIds() {
  const response = await fetch(BASE_URL);
  const products = await response.json();
  return products.data.map(product => ({
      params: {
          productId: product.id.toString(),
      },
  }));
}

