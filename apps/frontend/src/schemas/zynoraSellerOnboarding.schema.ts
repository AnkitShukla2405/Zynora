import { z } from "zod";

/* -------------------- Reusable Constants -------------------- */

const MAX_FileSize  = 2 * 1024 * 1024

const documentFileSchema= z
.instanceof(File)
.refine((file) => file.size <= MAX_FileSize, {
  message: "File size must be less than 2MB"
})
.refine(
  (file) => 
  ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
  {
    message: "Only PDF, JPG, PNG files are allowed",
  }
)

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FileSize, {
    message: "Image size must be less than 2MB",
  })
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    {
      message: "Only JPG, PNG, WEBP images are allowed",
    }
  );

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

/* -------------------- Main Schema -------------------- */

export const zynoraSellerOnboardingSchema = z
  .object({
    /* ---------- Step 1: Business Identity ---------- */

    gstin: z
      .string()
      .length(15, "GSTIN must be exactly 15 characters")
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GSTIN format"
      ),

    pan: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format"),

    businessName: z.string().min(3, "Business name is required"),

    businessType: z.enum([
      "proprietorship",
      "llp",
      "pvt_ltd",
      "public_ltd",
    ]),

    natureOfBusiness: z.enum([
      "manufacturer",
      "reseller",
      "d2c",
      "wholesaler",
    ]),

  gstStatus: z.literal("active", {
  message: "GSTIN must be verified",
}),

    /* ---------- Step 2: Logistics ---------- */

    address: z.string().min(5, "Pickup address is required"),

    city: z.string().min(2, "City is required"),

    state: z.string(),

    pincode: z
      .string()
      .regex(/^\d{6}$/, "Invalid pincode"),

    pickupContactName: z.string().min(2, "Contact name is required"),

    pickupPhone: z.string().regex(
      /^(?:(?:\+91|91|0)?[\s-]?)?[6-9]\d{9}$/,
      "Invalid phone number"
    ),

    returnAddressSame: z.boolean(),

    returnAddress: z.string().optional(),
    returnCity: z.string().optional(),
    returnState: z.string().optional(),
    returnPincode: z.string().optional(),

    /* ---------- Step 3: Bank & Compliance ---------- */

    accountHolderName: z.string().min(3, "Account holder name is required"),

    accountNumber: z
      .string()
      .min(6, "Account number is required"),

    ifsc: z
      .string(),

    settlementCycle: z.literal("T+2"),

    bankDocument: documentFileSchema.optional(),

    /* ---------- Step 4: Storefront ---------- */

    storeLogo: imageFileSchema.optional(),

    storeDisplayName: z
      .string()
      .min(3, "Store display name is required"),

    supportEmail: z
      .string()
      .email("Invalid support email"),

    storeDescription: z
      .string()
      .max(500, "Max 500 characters")
      .optional(),
  })

  /* ---------- Conditional Validation ---------- */
  .superRefine((data, ctx) => {
    if(!data.returnAddressSame) {
      if(!data.returnAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnAddress"],
          message: "Return address is required"
        })
      }

      if(!data.returnCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnCity"],
          message: "Return city is required"
        })
      }

      if(!data.returnState) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnState"],
          message: "Return state is required"
        })
      }

      if(!data.returnPincode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["returnPincode"],
          message: "Return pincode is required"
        })
      }
    }


  })


  export type zynoraSellerOnboardingData = z.infer<typeof zynoraSellerOnboardingSchema>