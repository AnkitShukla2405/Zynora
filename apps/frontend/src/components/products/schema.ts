import { z } from 'zod';



export const productSchema = z.object({
    // 1. Basic Product Identity
    name: z.string().min(5, "Product name must be at least 5 characters"),
    brand: z.string().min(2, "Brand is required"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    slug: z.string().min(5, "Slug must be valid"), // We'll auto-generate this but allow edits
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Sub-category is required"),
    productType: z.string().min(1, "Product Type is required"),

    // 2. Product Highlights (Bullet points)
    highlights: z.array(z.object({
        text: z.string().min(5, "Highlight text must be at least 5 characters")
    })).min(1, "Add at least one highlight").max(5, "Maximum 5 highlights allowed"),

    // 3. Pricing & Offer
    mrp: z.coerce.number().min(1, "MRP is required"),
    sellingPrice: z.coerce.number().min(1, "Selling price is required"),
    // discount is derived, no need to validate if we calculate it. 
    // But if we want to validte logic:
    // sellingPrice <= mrp

    // 4. Product Media
  
    // 5. Variants
    variants: z.array(z.object({
        sku: z.string().min(3, "SKU is required"),
        price: z.coerce.number().min(1, "Variant selling price is required"),
        stock: z.coerce.number().min(0, "Stock cannot be negative"),
        attributes: z.record(z.string(), z.string()).optional(),

       variantImages: z.array(
  z.object({
    clientId: z.string(),
    preview: z.string().optional(),
    // Tell Zod to accept the native File object
    file: z.custom<File>((v) => v instanceof File, {
      message: "Image file is required",
    }), 
  })
)
    })).min(1, "Add at least one variant"),

    // 6. Inventory (Global/Summary logic can be derived, but maybe we want a threshold)
    lowStockThreshold: z.coerce.number().min(0).default(5),

    // 7. Description Tabs
    specifications: z.array(z.object({
        key: z.string().min(1, "Key required"),
        value: z.string().min(1, "Value required")
    })).optional(),

    // 8. Delivery & Returns
    deliveryTime: z.string().min(1, "Delivery time text is required"),
    returnPolicy: z.string().min(1, "Return policy is required"),
    isReturnable: z.boolean().default(true),



}).refine((data) => data.sellingPrice <= data.mrp, {
    message: "Selling price cannot be higher than MRP",
    path: ["sellingPrice"],
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const DEFAULT_VALUES: Partial<ProductFormValues> = {
    name: "",
    brand: "",
    description: "",
    slug: "",
    category: "",
    subCategory: "",
    highlights: [{ text: "" }],
    mrp: 0,
    sellingPrice: 0,
    variants: [],
    lowStockThreshold: 10,
    specifications: [{ key: "Material", value: "" }],
    deliveryTime: "3-5 business days",
    returnPolicy: "7-day return policy",
    isReturnable: true
};
