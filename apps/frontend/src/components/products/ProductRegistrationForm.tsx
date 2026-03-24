"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, DEFAULT_VALUES, ProductFormValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud } from "lucide-react";

// Form Sections
import { BasicIdentity } from "./form-sections/BasicIdentity";
import { ProductHighlights } from "./form-sections/ProductHighlights";
import { PricingOffer } from "./form-sections/PricingOffer";
import { ProductVariants } from "./form-sections/ProductVariants";
import { InventoryAvailability } from "./form-sections/InventoryAvailability";
import { DescriptionTabs } from "./form-sections/DescriptionTabs";
import { DeliveryReturns } from "./form-sections/DeliveryReturns";
import { SellerInfo } from "./form-sections/SellerInfo";
import { SeoPreview } from "./form-sections/SeoPreview";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";

type RegisterSellerProductResponse = {
  registerSellersProduct: {
    success: boolean;
    message: string;
  };
};

type UploadProductImagesResponse = {
  productUpload: {
    url: string;
    key: string;
    sku: string;
    order: number;
    clientId: string;
  }[];
};

const Upload_Product_Variant_Images = gql`
  mutation UploadProductVariantImages(
    $productImages: [ProductVariantImageUploadInput!]!
  ) {
    productUpload(productImages: $productImages) {
      url
      key
      sku
      order
      clientId
    }
  }
`;

const Register_Seller_Product = gql`
  mutation RegisterProductSeller($data: ProductRegistrationInput!) {
    registerSellersProduct(data: $data) {
      success
      message
    }
  }
`;

export default function ProductRegistrationForm() {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any, // Cast to any to resolve strict type mismatch with RHF
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const onSaveDraft = () => {
    const data = methods.getValues();
    console.log("💾 DRAFT DATA:", data);
    alert("Draft Saved! Check console.");
  };

  const [uploadProductVariantImages, { loading, error }] = useMutation<UploadProductImagesResponse>(
    Upload_Product_Variant_Images,
  );
  const [registerSellerProduct] = useMutation<RegisterSellerProductResponse>(Register_Seller_Product);

  const productId = crypto.randomUUID();

  const onSubmit = async (data: ProductFormValues) => {
    console.log("I am clicked")
const productImages = data.variants.flatMap((variant) => {
    return variant.variantImages.map((imageObj, index) => {
      return {
        clientId: imageObj.clientId,
        productId,
        sku: variant.sku,
        contentType: imageObj.file.type, // Now this will work
        order: index,
        file: imageObj.file, // Safely extracted
      };
    });
  });

  const uploadPayload = productImages.map(({ clientId, productId, sku, contentType, order }) => ({
    productId,
    clientId,
    sku,
    contentType,
    order,
  }));

    console.log("uploadPayload", uploadPayload)

    const { data: uploadResult } = await uploadProductVariantImages({
      variables: {
        productImages: uploadPayload,
      },
    });

    if (!uploadResult) {
  throw new Error("Image upload failed: No response from server");
}

    const presignedUrls = uploadResult.productUpload;

    console.log(":   ", presignedUrls)

    await Promise.all(
      presignedUrls.map(async (p) => {
        const fileObj = productImages.find(
          (img) => img.clientId === p.clientId
        );

        if (!fileObj?.file?.type) {
          throw new Error("Invalid file type");
        }

        const res = await fetch(p.url, {
          method: "PUT",
          headers: {
            "Content-Type": fileObj?.file.type,
          },
          body: fileObj?.file,
        });

        if(!res.ok) {
          throw new Error(`Upload failed for SKU ${p.sku}`);
        }
      }),
    );

    const variantForDB = data.variants.map((variant) => ({
      sku: variant.sku,
      stock: variant.stock,
       attributes: Object.entries(variant.attributes || {})
  .filter(([_, value]) => value !== undefined && value !== "")
  .map(([key, value]) => ({
    key,
    value: String(value),
  })),
      variantImages: presignedUrls
        .filter((img) => img.sku === variant.sku)
        .map((img) => ({
          key: img.key,
          order: img.order,
        })),
    }));

    console.log("variant: ", variantForDB)

    const highlightForDB = data.highlights.map((i) => ({
      text: i.text,
    }));

    console.log(highlightForDB);
    

    const result = await registerSellerProduct({
      variables: {
        data: {
          ...data,
          variants: variantForDB,
          highlights: highlightForDB,
        },
      },
    });

    if (result.data?.registerSellersProduct?.success) {
      alert("Product registered successfully");
    } else {
      toast.error(result.data?.registerSellersProduct?.message || " Something went wrong");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen pb-20 bg-gray-50/50"
      >
        {/* Header / Sticky Action Bar */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              New Product
            </h1>
            <p className="text-sm text-gray-500">
              Create a new product card for the marketplace
            </p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              Publish Product
            </Button>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-12 gap-8">
          {/* LEFT COLUMN - Main Form Data */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* 1. Basic Identity */}
            <BasicIdentity />

            {/* 3. Pricing & Offer */}
            <PricingOffer />

            {/* 4. Variants */}
            <ProductVariants />

            {/* 5. Highlights */}
            <ProductHighlights />

            {/* 6. Description Tabs */}
            <DescriptionTabs />
          </div>

          {/* RIGHT COLUMN - Meta & Summary */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* 7. Inventory Summary / Availability */}
            <InventoryAvailability />

            {/* 8. Delivery & Returns */}
            <DeliveryReturns />

            {/* 9. Seller Info */}
            <SellerInfo />

            {/* 10. SEO Preview */}
            <SeoPreview />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
