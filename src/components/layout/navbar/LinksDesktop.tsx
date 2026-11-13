"use client";

import { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function LinksDesktop() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="relative flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none overflow-hidden focus:shadow-md"
                    href="/"
                  >
                    <Image
                      src="/coat.webp"
                      alt=""
                      fill
                      className="absolute inset-0 w-full h-full rounded-xl"
                    />

                    <div className="relative mt-4 mb-1 text-sm font-medium">
                      VIEW ALL
                    </div>

                    <p className="relative text-sm leading-tight text-muted-foreground">
                      Discover wardrobe staples for every occasion.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/dresses" title="Dresses">
                Our dresses blend timeless elegance with modern style, crafted
                in a variety of designs, colors, and fabrics. From effortless
                everyday looks to special occasions, find a dress that feels
                uniquely yours.
              </ListItem>
              <ListItem href="/tops" title="Tops">
                Our tops bring together effortless style and lasting quality in
                a range of colors, cuts, and textures. From simple essentials to
                standout pieces, find the perfect top for every look.
              </ListItem>
              <ListItem href="/bags" title="Bags">
                Our bags combine practical design with refined style and quality
                materials. From everyday essentials to statement pieces, find
                the perfect bag to carry your style anywhere.
              </ListItem>
              <ListItem href="/skirts" title="Skists">
                Our skirts combine feminine style with quality fabrics and
                thoughtful designs. From classic silhouettes to modern cuts,
                find the perfect piece for any occasion.
              </ListItem>
              <ListItem href="/shoes" title="Shoes">
                Our shoes bring together comfort, quality, and timeless style.
                Discover versatile designs made to complete your look, from
                everyday essentials to elegant favorites.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  Omit<React.ComponentPropsWithoutRef<"a">, "href"> & { href: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:bg-background-tertiary",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-[]">
            {title}
          </div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground text-color-secondary">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
