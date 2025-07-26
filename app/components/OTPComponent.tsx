"use client";

import { useState, useRef } from "react";
import PinField from "react-pin-field";
import { toast } from "react-toastify";
import { useVerifySignUpMutation } from "../Redux/services/AuthApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function OtpComponent({ setSelectedTabIdx, formData }: any) {
  const [isLoding, setIsLoading] = useState(false);
  const [verifySignUp] = useVerifySignUpMutation();
  const [otp, setOtp] = useState("");
  const pinRef = useRef<HTMLInputElement[] | null>(null);
  const router = useRouter();

  const handleComplete = (value: string) => {
    // console.log("Entered OTP:", value);
    setOtp(value);
  };

  const handleResend = () => {
    setOtp("");
    pinRef.current?.[0]?.focus(); // Optional chaining
    // You can call resend API here
  };
  const handleVeriSignup = async ({ _id }: any) => {
    setIsLoading(true);
    const payload = {
      email: formData?.email,
      pin: otp,
    };
    try {
      const response = await verifySignUp({ userData: payload });
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
        if (response?.data?.message === "User registered successfully") {
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

  return (
    <div className=" flex items-center justify-center  px-4 backdrop-blur-xl border-4 bg-black/2 border-gray-500">
      <p
        className="mx-5 my-2 text-white cursor-pointer"
        onClick={() => setSelectedTabIdx(0)}
      >
        {" "}
        Back
      </p>
      <div className=" shadow-md rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-2">Enter OTP</h2>
        <p className="text-center text-sm text-gray-400 mb-4">
          OTP sent to your Email
        </p>

        <div className="flex justify-center mb-4 py-5">
          <PinField
            ref={pinRef}
            length={6}
            onComplete={handleComplete}
            onChange={(value) => setOtp(value)} // ✅ this line ensures OTP stays in sync
            autoFocus
            className="w-10 h-12 border border-gray-300 rounded-md text-center text-lg mx-1 focus:outline-blue-500"
          />
        </div>

        <button
          onClick={handleVeriSignup}
          className="w-full bg-[#936eff] text-white py-2 rounded-md hover:opacity-90 cursor-pointer"
          disabled={otp.length !== 6 || isLoding}
        >
          {isLoding ? "Loading..." : "          Verify OTP"}
        </button>

        <div className="text-center text-sm mt-3">
          Didn’t receive the code?{" "}
          <button
            onClick={handleResend}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}
