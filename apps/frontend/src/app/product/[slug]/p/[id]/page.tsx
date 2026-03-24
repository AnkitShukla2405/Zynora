import ProductDetailsClient from "@/components/pdp/ProductDetailPage";


type PageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug, id } = await params;

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <ProductDetailsClient slug={slug} id={id} />
      </div>
    </div>
  );
}