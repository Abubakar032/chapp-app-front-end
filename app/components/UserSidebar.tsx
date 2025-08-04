// components/Sidebar.tsx
import React, { useRef, useState } from "react";
import InputFeild from "./InputFeild";
import Image from "next/image";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Cookies from "js-cookie";

import socket from "@/utils/socket";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UserSideBarProps {
  setSelectedUser: any;
  selectedUser: any;
  Profile: any;
  onlineUsers: any;
  unSeenMessages?: any;
  setProfileUpdate?: any;
  setResponsiveTab?: any;
  setMdResponsiveTab?: any;
  userList: {
    users: Array<{
      fullName: string;
      profilImage?: string;
      _id?: string;
      email?: string;
    }>;
    unseenMessages?: {
      [userId: string]: number;
    };
  };
}

const UserSideBar: React.FC<UserSideBarProps> = ({
  userList,
  setSelectedUser,
  selectedUser,
  onlineUsers,
  unSeenMessages,
  setProfileUpdate,
  setResponsiveTab,
  setMdResponsiveTab,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [logout, setLogout] = useState(false);
  const [value, setValue] = useState(""); // search input state
  const hideMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleMouseEnter = () => {
    if (hideMenuTimeout.current) {
      clearTimeout(hideMenuTimeout.current);
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    hideMenuTimeout.current = setTimeout(() => {
      setShowMenu(false);
    }, 1000); // 1 second delay
  };

  const handLogOut = (): void => {
    setLogout(true);
    Cookies.remove("token");
    setTimeout(() => {
      setLogout(false);
      socket.disconnect();
      setShowMenu(false);
      router.replace("/sign-in");
      toast.success("Logout Successfully");
    }, 2000);
  };

  return (
    <div className="w-full text-white p-4 z-10 border-gray-500 h-full bg-white/10 backdrop-blur-lg flex flex-col">
      <div className="flex gap-4 justify-between">
        <div className="flex gap-2">
          <Image
            src="/assets/images/logo_icon.svg"
            width={30}
            height={30}
            alt="logo"
          />
          <h2 className="text-xl font-bold">QuickChat</h2>
        </div>

        {/* Dots Menu */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <BiDotsVerticalRounded size={25} className="cursor-pointer" />

          {showMenu && (
            <div className="absolute top-5 right-0 cursor-pointer bg-white text-black rounded-md shadow-lg py-2 w-40 z-50">
              <button
                onClick={() => {
                  setProfileUpdate?.(1);
                  setShowMenu(false);
                  setSelectedUser({});
                  setResponsiveTab?.(1);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Update Profile
              </button>
              <button
                onClick={handLogOut}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  logout ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <InputFeild
        type="text"
        className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-2xl focus:border-gray-500 focus:outline-none transition-all text-gray-300"
        placeholder="Search user..."
        onchange={(e) => {
          setValue(e.target.value);
        }}
      />

      <ul className="flex-1 overflow-y-auto AtScrollHide py-4 pb-5 space-y-2 px-1 scrollbar-thin scrollbar-thumb-gray-700">
        {userList?.users.filter(
          (user: any) =>
            user.fullName.toLowerCase().includes(value.toLowerCase()) ||
            user.email?.toLowerCase().includes(value.toLowerCase())
        ).length === 0 ? (
          <li className="text-center text-gray-300 py-8">No user found</li>
        ) : (
          userList?.users
            .filter(
              (user: any) =>
                user.fullName.toLowerCase().includes(value.toLowerCase()) ||
                user.email?.toLowerCase().includes(value.toLowerCase())
            )
            .map((user: any, index: any) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedUser(user);
                  setProfileUpdate?.(0);
                  setResponsiveTab?.(1);
                  setMdResponsiveTab?.(0);
                }}
                className={`flex items-center justify-between gap-2 p-2 hover:bg-white/30 rounded-2xl cursor-pointer ${
                  unSeenMessages?.[user._id] ? "" : ""
                } ${
                  user?._id === selectedUser?._id
                    ? "bg-white/30 border-2 border-gray-400"
                    : ""
                }`}
              >
                <div className="flex w-full">
                  <Image
                    src={
                      user?.profilImage
                        ? user.profilImage
                        : `/assets/images/avatar_icon.png`
                    }
                    width={30}
                    height={30}
                    alt="avatar"
                    className="rounded-full w-8 h-8"
                  />
                  <div className="ml-2">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p
                      className={`text-xs font-bold ${
                        onlineUsers.includes(user._id)
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    >
                      {onlineUsers.includes(user._id)
                        ? "🟢 online"
                        : "⚪ offline"}
                    </p>
                  </div>
                </div>
                {unSeenMessages?.[user._id] && (
                  <span className="border text-white font-semibold w-5 h-5 bg-[#936eff] rounded-full text-sm text-center">
                    {unSeenMessages[user._id]}
                  </span>
                )}
              </li>
            ))
        )}
      </ul>
    </div>
  );
};

export default UserSideBar;
