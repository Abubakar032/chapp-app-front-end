import Button from "@/app/components/Button";
import InputFeild from "@/app/components/InputFeild";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignInModule = () => {
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

        <div className="border-3   rounded-lg px-3 md:px-5 py-2 border-gray-400 w-[90%] mx-auto md:w-[80%]  backdrop-blur-xl">
          <h1 className="font-bold text-2xl">Sign Up</h1>
          <br />
          <InputFeild
            type="text"
            className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
            placeholder="Email Address"
          />
          <br />
          <InputFeild
            type="text"
            className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
            placeholder="Email Address"
          />
          
          <InputFeild
            type="password"
            className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
            placeholder="Password"
          />
          <Button className="bg-[#936eff] px-4 py-3 w-full cursor-pointer hover:opacity-90 my-4 rounded-lg">
            Create Account
          </Button>
          <p className="text-gray-400">
            Already Have An Account{" "}
            <span className="text-[#936eff] cursor-pointer">
              <Link href="/sign-in">Login Now</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModule;
