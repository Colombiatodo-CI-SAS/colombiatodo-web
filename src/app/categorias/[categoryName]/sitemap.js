import { BASE_URL, getAllCategoriesId } from "@/services/GetCategories";

export async function generateSitemaps() {
  // Fetch the total number of categories and calculate the number of sitemaps needed
  const categories = await getAllCategoriesId();
  const totalCategories = categories.length;
  const sitemapsCount = Math.ceil(totalCategories / 50000);

  return Array.from({ length: sitemapsCount }, (_, index) => ({ id: index }));
}

export default async function sitemap({ params }) {
  const { id } = params;
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000;
  const end = start + 50000;
  const categories = await getCategoriesInRange(start, end);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories
    .map((category) => {
      return `
  <url>
    <loc>${BASE_URL}/categorias/${category.attributes.slug}</loc>
    <lastmod>${new Date(category.attributes.updatedAt).toISOString()}</lastmod>
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

async function getCategoriesInRange(start, end) {
  // Implement your logic to fetch categories in the given range
  const response = await fetch(`${BASE_URL}&pagination[start]=${start}&pagination[end]=${end}`);
  const categories = await response.json();
  return categories.data;
}