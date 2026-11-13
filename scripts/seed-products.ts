import { config } from "dotenv";

config({ path: ".env.local" });

import { db } from "@/lib/db";
import { productsItems } from "@/lib/db/drizzle/schema/products";

const categories = {
  "womens-dresses": "dresses",
  tops: "tops",
  "womens-shoes": "shoes",
  "womens-bags": "bags",
  "womens-jewellery": "jewellery",
  "womens-watches": "watches",
} as const;

type DummyProduct = {
  title: string;
  description: string;
  price: number;
  images: string[];
};

async function fetchProducts(category: string) {
  const response = await fetch(
    `https://dummyjson.com/products/category/${category}?limit=100`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${category}`);
  }

  const data = await response.json();

  return data.products as DummyProduct[];
}

async function main() {
  const products = [];

  for (const [apiCategory, dbCategory] of Object.entries(categories)) {
    console.log(`Fetching ${apiCategory}...`);

    const items = await fetchProducts(apiCategory);

    for (const product of items) {
      const image = product.images?.[0];

      if (!image) {
        console.log(`Skipping ${product.title} - no image`);
        continue;
      }

      products.push({
        name: product.title,
        description: product.description,
        price: product.price.toString(),
        category: dbCategory,
        img: image,
      });
    }
  }

  console.log(`Preparing ${products.length} products...`);

  await db.insert(productsItems).values(products);

  console.log("✅ Products imported successfully!");
}

main().catch((error) => {
  console.error("❌ Import failed:", error);
  process.exit(1);
});