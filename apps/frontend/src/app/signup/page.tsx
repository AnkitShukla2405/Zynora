import { Suspense } from "react";
import ZynoraEnterpriseAuth from "@/components/auth/SignupClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ZynoraEnterpriseAuth />
    </Suspense>
  );
}