// components/Sidebar.tsx
import React, { use, useState } from "react";
import InputFeild from "./InputFeild";
import Image from "next/image";

interface User {
  name: string;
  status: "Online" | "Offline";
}

interface UserSideBarProps {
  setSelectedUser: any;
  selectedUser: any;
  userList: {
    users: Array<{
      fullName: string;
      profilImage?: string;
    }>;
  };
}

const UserSideBar: React.FC<UserSideBarProps> = ({
  userList,
  setSelectedUser,
  selectedUser
}) => {

  return (
    <div className=" w-full text-white p-4 z-10  border-gray-500 h-full bg-white/10  backdrop-blur-lg">
      <div className=" flex gap-4">
        <Image
          src="/assets/images/logo_icon.svg"
          width={30}
          height={30}
          alt="logo"
        />
        <h2 className="text-xl font-bold ">QuickChat</h2>
      </div>

      <InputFeild
        type="text"
        className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-2xl  focus:border-gray-500 focus:outline-none transition-all text-gray-300"
        placeholder="Search user..."
      />
      <ul className="space-y-2">
        {userList?.users.map((user: any, index: any) => (
          <li
            key={index}
            onClick={() => {
 
              setSelectedUser(user);
            }}
            className={`flex items-center gap-2 p-2 hover:bg-gray-600 rounded-2xl cursor-pointer ${
              user?._id === selectedUser?._id ? "bg-gray-600 border-2 border-gray-400" : ""
            }`}
          >
            <Image
              src={
                user?.profilImage
                  ? user?.profilImage
                  : `/assets/images/avatar_icon.png`
              }
              width={30}
              height={30}
              alt="logo"
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-400">Offline</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSideBar;
