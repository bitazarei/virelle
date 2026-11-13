import { pgTable, index, unique, pgPolicy, text, boolean, timestamp, check, bigserial, varchar, numeric, foreignKey, bigint, integer, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const productCategory = pgEnum("product_category", ['t-shirts', 'pants', 'sweatshirts'])
export const sizes = pgEnum("sizes", ['XS', 'S', 'M', 'L', 'XL', 'XXL'])


export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_user_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_user_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("user_email_unique").on(table.email),
	pgPolicy("Backend can manage auth users", { as: "permissive", for: "all", to: ["public"], using: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`, withCheck: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`  }),
	pgPolicy("Users can view own profile", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("Users can update own profile", { as: "permissive", for: "update", to: ["public"] }),
]);

export const productsItems = pgTable("products_items", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	category: productCategory().notNull(),
	img: varchar({ length: 500 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_products_category").using("btree", table.category.asc().nullsLast().op("enum_ops")),
	index("idx_products_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_products_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("idx_products_updated_at").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	pgPolicy("Backend can manage products", { as: "permissive", for: "all", to: ["public"], using: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`, withCheck: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`  }),
	pgPolicy("Anyone can view products", { as: "permissive", for: "select", to: ["anon"] }),
	check("price_positive", sql`price > (0)::numeric`),
]);

export const productsVariants = pgTable("products_variants", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
	stripeId: varchar("stripe_id", { length: 255 }).notNull(),
	color: varchar({ length: 100 }).notNull(),
	sizes: sizes().array().notNull(),
	images: text().array().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_variants_color").using("btree", table.color.asc().nullsLast().op("text_ops")),
	index("idx_variants_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_variants_product_id").using("btree", table.productId.asc().nullsLast().op("int8_ops")),
	index("idx_variants_stripe_id").using("btree", table.stripeId.asc().nullsLast().op("text_ops")),
	index("idx_variants_updated_at").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsItems.id],
			name: "products_variants_product_id_products_items_id_fk"
		}).onDelete("cascade"),
	unique("product_color_unique").on(table.productId, table.color),
	unique("products_variants_stripe_id_unique").on(table.stripeId),
	pgPolicy("Backend can manage variants", { as: "permissive", for: "all", to: ["public"], using: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`, withCheck: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`  }),
	pgPolicy("Anyone can view variants", { as: "permissive", for: "select", to: ["anon"] }),
]);

export const cartItems = pgTable("cart_items", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	userId: text("user_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	variantId: bigint("variant_id", { mode: "number" }).notNull(),
	quantity: integer().default(1).notNull(),
	size: sizes().notNull(),
	stripeId: text("stripe_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_cart_updated_at").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_cart_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("idx_cart_user_variant_size").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.variantId.asc().nullsLast().op("text_ops"), table.size.asc().nullsLast().op("enum_ops")),
	index("idx_cart_variant_id").using("btree", table.variantId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "cart_items_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [productsVariants.id],
			name: "cart_items_variant_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("cart_user_variant_size_unique").on(table.userId, table.variantId, table.size),
	pgPolicy("Users can view own cart items", { as: "permissive", for: "select", to: ["public"], using: sql`(app.current_user_id() = user_id)` }),
	pgPolicy("Users can insert own cart items", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can update own cart items", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Users can delete own cart items", { as: "permissive", for: "delete", to: ["public"] }),
	check("quantity_positive", sql`quantity > 0`),
]);

export const wishlist = pgTable("wishlist", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	userId: text("user_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_wishlist_product_id").using("btree", table.productId.asc().nullsLast().op("int8_ops")),
	index("idx_wishlist_updated_at").using("btree", table.updatedAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_wishlist_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("idx_wishlist_user_product").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.productId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsItems.id],
			name: "wishlist_product_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "wishlist_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("wishlist_user_product_unique").on(table.userId, table.productId),
	pgPolicy("Users can view own wishlist items", { as: "permissive", for: "select", to: ["public"], using: sql`(app.current_user_id() = user_id)` }),
	pgPolicy("Users can insert own wishlist items", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Users can delete own wishlist items", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const orderItems = pgTable("order_items", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	userId: text("user_id").notNull(),
	deliveryDate: timestamp("delivery_date", { withTimezone: true, mode: 'string' }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderNumber: bigint("order_number", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_order_items_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_order_items_delivery_date").using("btree", table.deliveryDate.asc().nullsLast().op("timestamptz_ops")),
	index("idx_order_items_order_number").using("btree", table.orderNumber.asc().nullsLast().op("int8_ops")),
	index("idx_order_items_user_created").using("btree", table.userId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_order_items_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "order_items_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("order_items_order_number_unique").on(table.orderNumber),
	pgPolicy("Backend can manage orders", { as: "permissive", for: "all", to: ["public"], using: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`, withCheck: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`  }),
	pgPolicy("Users can view own orders", { as: "permissive", for: "select", to: ["public"] }),
]);

export const customerInfo = pgTable("customer_info", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderId: bigint("order_id", { mode: "number" }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	phone: text(),
	address: jsonb().notNull(),
	stripeOrderId: text("stripe_order_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPrice: bigint("total_price", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_customer_info_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_customer_info_order_id").using("btree", table.orderId.asc().nullsLast().op("int8_ops")),
	index("idx_customer_info_stripe_order_id").using("btree", table.stripeOrderId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orderItems.id],
			name: "customer_info_order_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("customer_info_order_id_unique").on(table.orderId),
	unique("customer_info_stripe_order_id_unique").on(table.stripeOrderId),
	pgPolicy("Backend can manage customer info", { as: "permissive", for: "all", to: ["public"], using: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`, withCheck: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`  }),
	pgPolicy("Users can view own customer info", { as: "permissive", for: "select", to: ["public"] }),
]);

export const orderProducts = pgTable("order_products", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderId: bigint("order_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	variantId: bigint("variant_id", { mode: "number" }).notNull(),
	quantity: integer().notNull(),
	size: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_order_products_order_id").using("btree", table.orderId.asc().nullsLast().op("int8_ops")),
	index("idx_order_products_variant_id").using("btree", table.variantId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orderItems.id],
			name: "order_products_order_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [productsVariants.id],
			name: "order_products_variant_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	pgPolicy("Backend can manage order products", { as: "permissive", for: "all", to: ["public"], using: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`, withCheck: sql`(current_setting('request.jwt.claim.role'::text, true) IS NULL)`  }),
	pgPolicy("Users can view own order products", { as: "permissive", for: "select", to: ["public"] }),
	check("order_quantity_positive", sql`quantity > 0`),
]);
