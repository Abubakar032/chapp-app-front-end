// components/ProfileSidebar.tsx
import React, { useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import socket from "@/utils/socket";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa6";

interface ProfileSidebarProps {
  selectedUser: any;
  messages: any;
  setResponsiveTab?: any;
  setMdResponsiveTab?: any;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  selectedUser,
  messages,
  setResponsiveTab,
  setMdResponsiveTab,
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
    }, 2000);
  };

  return (
    <div className="w-full text-white flex flex-col h-full bg-white/10 backdrop-blur-lg relative">
      {/* Back button */}
      <button
        onClick={() => {
          setResponsiveTab?.(1);
          setMdResponsiveTab?.(0);
        }}
        className="text-gray-300 lg:hidden mb-10 cursor-pointer flex mx-5 mt-5 gap-2"
      >
        <p className="mt-1">
          <FaArrowLeft />
        </p>{" "}
        Back
      </button>

      {/* User info */}
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

      {/* Media section */}
      <div className="mt-2 w-full flex flex-col flex-grow">
        <p className="text-sm text-gray-300 mx-5">Media</p>
        <div className="flex gap-2 flex-wrap overflow-y-auto AtScrollHide  py-5  justify-center w-full scrollbar-thin scrollbar-thumb-gray-700 max-h-[50vh]  md:max-h-[40vh]">
          {messages.filter((msg: any) => msg.image).length === 0 ? (
            <p className="text-gray-400 text-center w-full">No media found</p>
          ) : (
            messages.map((msg: any, index: number) => {
              if (!msg.image) return null;
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
            })
          )}
        </div>
      </div>

      {/* Logout button */}
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
