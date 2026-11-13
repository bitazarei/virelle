/** COMPONENTS */
import { ProductImage } from "./ProductImage";
import Link from "next/link";

/** FUNCTIONALITY */
import dynamic from "next/dynamic";

/** TYPES */
import type { ProductWithVariants } from "@/lib/db/drizzle/schema";

const WishlistButton = dynamic(() => import("../wishlist/WishlistButton"));

interface ProductItemProps {
  product: ProductWithVariants;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const { name, id, img, price, category, variants } = product;

  // Use the same variant that the product page initially opens
  const firstVariant = variants[0];

  // The second image of that variant will appear on hover
  const hoverImage = firstVariant?.images?.[1];

  const productLink = firstVariant
    ? `/${category}/${id}?variant=${firstVariant.color}`
    : `/${category}/${id}`;

  return (
    <div className="flex flex-col justify-between border border-solid border-border-primary rounded-md overflow-hidden">
      <Link href={productLink} className="block">
        <ProductImage
          image={img}
          hoverImage={hoverImage}
          name={name}
          width={280}
          height={425}
          sizes="(max-width: 640px) 100vw, (max-width: 1154px) 33vw, (max-width: 1536px) 25vw, 20vw"
        />
      </Link>

      <div className="flex justify-between flex-col gap-2.5 p-3.5 bg-background-secondary z-10">
        <div className="flex justify-between w-full">
          <Link href={productLink} className="w-10/12">
            <h2 className="text-sm font-semibold truncate">{name}</h2>
          </Link>

          <WishlistButton productId={id} />
        </div>

        <div className="text-sm">{price.toFixed(2)} €</div>
      </div>
    </div>
  );
};
