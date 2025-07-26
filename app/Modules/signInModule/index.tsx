"use client";
import Button from "@/app/components/Button";
import InputFeild from "@/app/components/InputFeild";
import { useLoginMutation } from "@/app/Redux/services/AuthApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SignInModule = () => {
      const token = Cookies.get("token");
  const [isLoding, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login] = useLoginMutation();
  const router = useRouter();

  const handleLogin = async ({ _id }: any) => {
    setIsLoading(true);

    try {
      const response = await login({ userData: formData });
      //   toast.error(response?.error?.data?.message);
      if ("error" in response) {
        const errorMessage =
          (response.error as any)?.data?.message ||
          (response.error as any)?.message ||
          "An error occurred";
        toast.error(errorMessage);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        if (response?.data?.message) {
          Cookies.set("token", response?.data?.token, {
            expires: 7,
            path: "/",
            sameSite: "Lax",
            secure: false, // Set to true if you're on HTTPS
          });

          console.log(response?.data?.token, "token");
          toast.success(response?.data?.message);
          router.push("/");
          console.log(response, "response");
        }
      }
    } catch (err) {
      toast.error(`Error  user createing`);
    }
  };

  useEffect(()=>{
    if(token){
      router.push("/")
    }
  }, [router, token])

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
        <h1 className="font-bold text-2xl absolute top-10 right-1/3 md:hidden">
          QuickChat
        </h1>

        <div className="border-2   rounded-lg px-3 md:px-5 py-2 border-gray-400 w-[90%] mx-auto md:w-[80%] bg-black/20 backdrop-blur-2xl">
          <h1 className="font-bold text-2xl">Login</h1>

          <InputFeild
            type="text"
            className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
            placeholder="Email Address"
            onchange={(e: any) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <InputFeild
            type="password"
            className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
            placeholder="Password"
            onchange={(e: any) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button
            className="bg-[#936eff] w-full px-4 py-3 cursor-pointer hover:opacity-90 my-4 rounded-lg"
            onClick={handleLogin}
          >
            {isLoding ? "Loading..." : "Login Now"}
          </Button>
          <p className="text-gray-400">
            Create An Account{" "}
            <span className="text-[#936eff] cursor-pointer">
              <Link href="/sign-up">Click Here</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModule;
