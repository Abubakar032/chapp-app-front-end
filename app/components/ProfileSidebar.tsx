// components/ProfileSidebar.tsx
import React, { useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProfileSidebar: React.FC = () => {
  const [isLogout, setLogout] = useState(false);
  const router = useRouter();
  const handLogOut = (): void => {
    setLogout(true);
    Cookies.remove("token");
    setTimeout(() => {
      setLogout(false);
      router.replace("/sign-in");
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="w-full text-white  flex flex-col h-full bg-white/10  backdrop-blur-lg relative  ">
      <div className="flex flex-col items-center py-5 border-b border-gray-500">
        <Image
          src="/assets/images/avatar_icon.png"
          width={50}
          height={50}
          alt="logo"
          className="rounded-full"
        />
        <h3 className="text-lg font-semibold py-1">John Johnson</h3>
        <p className="text-sm text-gray-200 text-center mt-1">
          Hi Everyone, I am Using QuickChat
        </p>
      </div>
      <div className="mt-6 w-full mx-5">
        <p className="text-sm text-gray-300 mb-2">Media</p>
      </div>
      <div className="absolute w-[75%] bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <button
          onClick={handLogOut}
          disabled={isLogout}
          className={`w-full bg-purple-600 hover:bg-purple-700 p-2 rounded-2xl cursor-pointer text-white ${
            isLogout && "opacity-50"
          }`}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
