import { BASE_URL, getAllProductIds } from "@/services/GetProducts";

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  const products = await getAllProductIds();
  const totalProducts = products.length;
  const sitemapsCount = Math.ceil(totalProducts / 50000);

  return Array.from({ length: sitemapsCount }, (_, index) => ({ id: index }));
}

export default async function sitemap({ params }) {
  const { id } = params;
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000;
  const end = start + 50000;
  const products = await getProductsInRange(start, end);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products
    .map((product) => {
      return `
  <url>
    <loc>${BASE_URL}/productos/${product.id}</loc>
    <lastmod>${new Date(product.attributes.updatedAt).toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  `;
    })
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

async function getProductsInRange(start, end) {
  // Implement your logic to fetch products in the given range
  const response = await fetch(`${BASE_URL}&pagination[start]=${start}&pagination[end]=${end}`);
  const products = await response.json();
  return products.data;
}