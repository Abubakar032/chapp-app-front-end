"use client";
import Button from "@/app/components/Button";
import InputFeild from "@/app/components/InputFeild";
import Link from "next/link";
import React from "react";

const SignUpForm = ({ formData, setFormData, handleSignUp, isLoding }: any) => {
  return (
    <div className=" w-full">
      <h1 className="font-bold text-2xl absolute top-10 right-1/3 md:hidden">
        QuickChat
      </h1>

      <div className="border-3   rounded-lg px-3 md:px-5 py-2 border-gray-400 w-[90%] mx-auto md:w-[80%]  backdrop-blur-xl">
        <h1 className="font-bold text-2xl">Sign Up</h1>
        <br />
        <InputFeild
          type="text"
          className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
          placeholder="Full Name"
          onchange={(e: any) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
        <br />
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
          className="bg-[#936eff] px-4 py-3 w-full cursor-pointer hover:opacity-90 my-4 rounded-lg"
          onClick={handleSignUp}
          disabled={isLoding}
        >
          {isLoding ? "Loading..." : "Create Account"}
        </Button>

        <p className="text-gray-400">
          Already Have An Account{" "}
          <span className="text-[#936eff] cursor-pointer">
            <Link href="/sign-in">Login Now</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
