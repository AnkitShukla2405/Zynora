import React from "react";
import ProductRegistrationForm from "@/components/products/ProductRegistrationForm";

export const metadata = {
    title: "New Product | Zynora",
    description: "Create a new product listing",
};

export default function NewProductPage() {
    return <ProductRegistrationForm />;
}
