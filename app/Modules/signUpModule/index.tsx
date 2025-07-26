"use client";
import OtpComponent from "@/app/components/OTPComponent";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SignUpForm from "./SignUpForm";
import { useSelector } from "react-redux";
import { useSignUpMutation } from "@/app/Redux/services/AuthApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
const SignInModule = () => {
  const router = useRouter();
  const token = Cookies.get("token");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [isLoding, setIsLoading] = useState(false);
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  const user = useSelector((state: any) => state.auth.user);
  const [signUp] = useSignUpMutation();

  const handleSignUp = async ({ _id }: any) => {
    setIsLoading(true);
    try {
      const response = await signUp({ userData: formData });

      if ("error" in response) {
        const errorMessage =
          (response.error as any)?.data?.message ||
          (response.error as any)?.message ||
          "An error occurred";
        toast.error(errorMessage);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        if (response) {
          setSelectedTabIdx(1);
          console.log(response, "response");
          toast.success(response?.data?.message);
        } else {
          // toast.error(response.data.data?.message);
        }
      }
    } catch (err) {
      toast.error(`Error  user createing`);
    }
  };

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [router, token]);

  return (
    <div className="h-[100vh] w-[100vw] grid md:grid-cols-2 mx-auto">
      {/* Only this absolute div remains */}
      <div className="absolute inset-0 z-0 bg-black/5 backdrop-blur-md"></div>

      <div className="z-10 md:grid md:place-content-center text-center w-full h-full text-white hidden">
        <Image
          src="/assets/images/logo_icon.svg"
          alt="logo"
          width={200}
          height={200}
        />
        <h1 className="font-semibold text-7xl">QuickChat</h1>
      </div>
      <div className="z-10   text-white grid place-content-center text-center md:w-[50vw]">
        {selectedTabIdx === 0 ? (
          <>
            <SignUpForm
              setFormData={setFormData}
              formData={formData}
              handleSignUp={handleSignUp}
              isLoding={isLoding}
            />
          </>
        ) : (
          <OtpComponent
            setSelectedTabIdx={setSelectedTabIdx}
            formData={formData}
          />
        )}
      </div>
    </div>
  );
};

export default SignInModule;
