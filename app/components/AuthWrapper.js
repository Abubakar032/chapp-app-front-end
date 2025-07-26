// app/components/AuthWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import AuthGuard from "./AuthGuard";
import { AuthRoutes } from "./AuthRoutes";
import { AuthLayout } from "@/app/components/AuthLayout";

export default function AuthWrapper({ children }) {
  const pathname = usePathname();

  if (AuthRoutes.includes(pathname)) {
    return (
      <>
        <AuthLayout>{children}</AuthLayout>
      </>
    );
  }

  return <AuthGuard>{children}</AuthGuard>;
}
