import { relations } from "drizzle-orm/relations";
import { productsItems, productsVariants, user, cartItems, wishlist, orderItems, customerInfo, orderProducts } from "./schema";

export const productsVariantsRelations = relations(productsVariants, ({one, many}) => ({
	productsItem: one(productsItems, {
		fields: [productsVariants.productId],
		references: [productsItems.id]
	}),
	cartItems: many(cartItems),
	orderProducts: many(orderProducts),
}));

export const productsItemsRelations = relations(productsItems, ({many}) => ({
	productsVariants: many(productsVariants),
	wishlists: many(wishlist),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	user: one(user, {
		fields: [cartItems.userId],
		references: [user.id]
	}),
	productsVariant: one(productsVariants, {
		fields: [cartItems.variantId],
		references: [productsVariants.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	cartItems: many(cartItems),
	wishlists: many(wishlist),
	orderItems: many(orderItems),
}));

export const wishlistRelations = relations(wishlist, ({one}) => ({
	productsItem: one(productsItems, {
		fields: [wishlist.productId],
		references: [productsItems.id]
	}),
	user: one(user, {
		fields: [wishlist.userId],
		references: [user.id]
	}),
}));

export const orderItemsRelations = relations(orderItems, ({one, many}) => ({
	user: one(user, {
		fields: [orderItems.userId],
		references: [user.id]
	}),
	customerInfos: many(customerInfo),
	orderProducts: many(orderProducts),
}));

export const customerInfoRelations = relations(customerInfo, ({one}) => ({
	orderItem: one(orderItems, {
		fields: [customerInfo.orderId],
		references: [orderItems.id]
	}),
}));

export const orderProductsRelations = relations(orderProducts, ({one}) => ({
	orderItem: one(orderItems, {
		fields: [orderProducts.orderId],
		references: [orderItems.id]
	}),
	productsVariant: one(productsVariants, {
		fields: [orderProducts.variantId],
		references: [productsVariants.id]
	}),
}));