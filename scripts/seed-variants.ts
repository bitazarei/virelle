import { config } from "dotenv";

config({ path: ".env.local" });

import { db } from "@/lib/db";
import { productsItems, productsVariants } from "@/lib/db/drizzle/schema";

async function main() {
  const products = await db.select().from(productsItems);

  console.log(`Found ${products.length} products.`);

  if (products.length === 0) {
    throw new Error("No products found.");
  }

  const variants = products.map((product) => {
    let sizes: (
      | "XS"
      | "S"
      | "M"
      | "L"
      | "XL"
      | "XXL"
      | "36"
      | "37"
      | "38"
      | "39"
      | "40"
      | "41"
    )[] = [];

    if (["dresses", "tops", "pants", "skirts"].includes(product.category)) {
      sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    }

    if (product.category === "shoes") {
      sizes = ["36", "37", "38", "39", "40", "41"];
    }

    return {
      productId: product.id,
      stripeId: `dummy-${product.id}`,
      color: "Default",
      sizes,
      images: [product.img],
    };
  });

  await db.insert(productsVariants).values(variants);

  console.log(`✅ Created ${variants.length} variants successfully!`);
}

main().catch((error) => {
  console.error("❌ Variant import failed:", error);
  process.exit(1);
});