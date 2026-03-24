// src/app/search/page.tsx

import { Suspense } from "react";
import SearchPageClient from "@/components/search/SearchPageClient";
import Loader from "@/components/Loader";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchPageClient />
    </Suspense>
  );
}