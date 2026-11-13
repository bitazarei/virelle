ALTER TABLE "products_items" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."product_category";--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('dresses', 'tops', 'pants', 'skirts', 'shoes', 'bags', 'jewellery', 'watches');--> statement-breakpoint
ALTER TABLE "products_items" ALTER COLUMN "category" SET DATA TYPE "public"."product_category" USING "category"::"public"."product_category";