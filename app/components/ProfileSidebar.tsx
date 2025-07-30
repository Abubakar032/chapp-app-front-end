// components/ProfileSidebar.tsx
import React, { useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import socket from "@/utils/socket";
import { toast } from "react-toastify";

interface ProfileSidebarProps {
  selectedUser: any;
  messages: any;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  selectedUser,
  messages,
}) => {
  const [isLogout, setLogout] = useState(false);
  const router = useRouter();
  const handLogOut = (): void => {
    setLogout(true);
    Cookies.remove("token");
    setTimeout(() => {
      setLogout(false);
      router.replace("/sign-in");
      toast.success("Logout Successfully");
      socket.disconnect();
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="w-full text-white  flex flex-col h-full bg-white/10  backdrop-blur-lg relative  ">
      <div className="flex flex-col items-center py-5 border-b border-gray-500">
        <Image
          src={
            selectedUser?.profilImage
              ? selectedUser.profilImage
              : "/assets/images/avatar_icon.png"
          }
          width={50}
          height={50}
          alt="avatar"
          className="rounded-full w-20 h-20"
        />
        <h3 className="text-lg font-semibold py-1">{selectedUser?.fullName}</h3>
        <p className="text-sm text-gray-200 text-center mt-1">
          {selectedUser?.bio}
        </p>
      </div>
      <div className=" mt-2 w-full ">
        <p className="text-sm text-gray-300  mx-5">Media</p>
        <div className=" flex  gap-2 flex-wrap overflow-y-auto AtScrollHide  h-[40vh] py-5 justify-center w-full  space-y-1  scrollbar-thin scrollbar-thumb-gray-700 ">
          {messages.map((msg: any, index: number) => {
            if (msg.image) {
              return (
                <Image
                  key={index}
                  src={msg.image}
                  alt="media"
                  width={100}
                  height={100}
                  className="rounded-lg w-[100px] h-[100px] object-cover cursor-pointer"
                />
              );
            }
            return null;
          })}
        </div>
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
