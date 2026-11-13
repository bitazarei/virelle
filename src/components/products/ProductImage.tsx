/** COMPONENTS */
import Image from "next/image";

/** FUNCTIONALITY */
import { cn } from "@/lib/utils";

/** TYPES */
import type { Product, ProductVariant } from "@/lib/db/drizzle/schema";

interface ProductImageProps {
  image: ProductVariant["images"][number];
  hoverImage?: ProductVariant["images"][number];
  name: Product["name"];
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  blurDataURL?: string | null;
  className?: string;
}

export const ProductImage = ({
  image,
  hoverImage,
  name,
  width,
  height,
  priority,
  sizes,
  quality,
  unoptimized,
  blurDataURL,
  className,
}: ProductImageProps) => {
  return (
    <div
      className="group relative w-full overflow-hidden"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Main image */}
      <Image
        fill
        src={image}
        alt={name}
        priority={priority}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL ?? undefined}
        quality={quality}
        unoptimized={unoptimized}
        sizes={sizes}
        className={cn(
          "object-cover brightness-90 transition-opacity duration-500 ease-in-out",
          hoverImage && "group-hover:opacity-0",
          className,
        )}
      />

      {/* Hover image */}
      {hoverImage && (
        <Image
          fill
          src={hoverImage}
          alt={`${name} - alternate view`}
          quality={quality}
          unoptimized={unoptimized}
          sizes={sizes}
          className={cn(
            "object-cover brightness-90 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100",
            className,
          )}
        />
      )}
    </div>
  );
};