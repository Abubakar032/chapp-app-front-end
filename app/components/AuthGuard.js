"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

const AuthGuard = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // ✅ replace router.pathname

  useEffect(() => {
    const authToken = Cookies.get("token");

    const isLoginPage = pathname === "/sign-in";
    const isSignUpPage = pathname === "/sign-up";

    if (authToken && (isLoginPage || isSignUpPage)) {
      router.push("/"); // ✅ redirect to dashboard
      return;
    }

    if (!authToken && !isLoginPage && !isSignUpPage) {
      router.push("/sign-in"); // ✅ redirect to sign-in
      return;
    }

    setIsLoading(false);
  }, [pathname]);

  return <>{isLoading ? "Loading..." : children}</>;
};

export default AuthGuard;
