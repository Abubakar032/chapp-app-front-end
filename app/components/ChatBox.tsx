"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { FaImage } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { BeatLoader, ClipLoader } from "react-spinners";

interface Message {
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt?: string;
}

interface User {
  _id?: string;
  fullName?: string;
  profilImage?: string;
}

interface ChatBoxProps {
  selectedUser: User;
  handleSendMessage: () => void;
  setText: (value: string) => void;
  text: string;
  messages: Message[];
  currentUserId: string;
  isSending?: boolean;
  handleTyping?: any;
  typing?: any;
  setImageFile?: any;
  imageFile?: any;
  onlineUsers: any;
  setProfileUpdate?: any;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  selectedUser,
  handleSendMessage,
  setText,
  text,
  messages,
  currentUserId,
  handleTyping,
  typing,
  setImageFile,
  imageFile,
  onlineUsers,
  setProfileUpdate,
  isSending = false,
}) => {
  const isDisabled =
    (!text.trim() && !imageFile) || !selectedUser?._id || isSending;

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 relative w-full text-white p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex justify-between pb-3 border-b-2 border-gray-600 px-2">
        <div className="flex gap-2">
          <Image
            src={
              selectedUser?.profilImage
                ? selectedUser.profilImage
                : "/assets/images/avatar_icon.png"
            }
            width={40}
            height={40}
            alt="avatar"
            className="rounded-full w-10 h-10"
          />
          <h2 className="text-lg font-semibold mt-2 flex">
            {selectedUser?.fullName || "Select a user"}{" "}
            {onlineUsers.includes(selectedUser._id) ? "🟢" : "⚪"}
          </h2>
        </div>
        <Image
          src="/assets/images/help_icon.png"
          width={20}
          height={20}
          alt="help"
          className="rounded-full mt-2 w-5 h-5 cursor-pointer"
          // onClick={() => setProfileUpdate(1)}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto AtScrollHide py-10 mt-4 space-y-2 px-1 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.length > 0 && selectedUser?._id ? (
          <>
            {messages.map((msg, idx) => {
              const isSender = msg.senderId === currentUserId;
              const isRelated =
                (msg.senderId === currentUserId &&
                  msg.receiverId === selectedUser._id) ||
                (msg.receiverId === currentUserId &&
                  msg.senderId === selectedUser._id);

              if (!isRelated) return null;

              const formattedTime = new Date(
                msg.createdAt ?? ""
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    isSender ? "items-end" : "items-start"
                  } mb-3`}
                >
                  <div
                    className={`w-fit max-w-[70%] p-2 rounded-2xl ${
                      isSender ? "bg-purple-600" : "bg-gray-700"
                    }`}
                  >
                    {msg.text && <p>{msg.text}</p>}
                    {msg.image && (
                      <Image
                        src={msg.image}
                        alt="attachment"
                        width={150}
                        height={150}
                        className="rounded-xl mt-2 w-[150px] h-[150px] object-cover"
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {formattedTime}
                  </span>
                </div>
              );
            })}

            <div ref={endOfMessagesRef} />
          </>
        ) : (
          <div className=" grid place-items-center h-full">
            {/* <div> */}
            <Image
              src="/assets/images/logo_icon.svg"
              width={150}
              height={150}
              alt="logo"
            />
            <p className=" text-2xl font-semibold">Chat anytime, anywhere</p>
            {/* </div> */}
          </div>
        )}
      </div>

      {/* Image Preview + Remove Button */}
      {imageFile && (
        <div className="relative w-fit my-2">
          <Image
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            width={100}
            height={100}
            className="rounded-lg"
          />
          <button
            onClick={() => setImageFile(null)}
            className="absolute -top-2 -right-2 bg-black/80 rounded-full text-white cursor-pointer"
            title="Remove image"
          >
            <IoCloseCircle size={24} />
          </button>
        </div>
      )}

      {/* Message Input */}
      {selectedUser?._id && (
        <>
          {typing && (
            <p className="text-gray-400 text-sm italic">
              <BeatLoader color="white" />
            </p>
          )}
          <div className="flex items-center gap-2 relative bottom-0 mb-1 pr-2 bg-black/20 backdrop-blur-lg w-full  border-2 border-gray-500 rounded-2xl focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300">
            <div className="w-full">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full py-2 px-3 backdrop-blur-lg border-gray-500 rounded-2xl focus:outline-none transition-all text-gray-300"
                placeholder="Send a message..."
                disabled={isSending || !selectedUser?._id}
                onKeyDown={handleTyping}
              />
            </div>

            {/* Image Upload */}
            <label className="cursor-pointer flex items-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
              <FaImage className="text-xl" title="Attach image" />
            </label>

            {/* Send Button */}
            <button
              className={`cursor-pointer transition-opacity duration-200 ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              onClick={!isDisabled ? handleSendMessage : undefined}
              disabled={isDisabled}
              aria-label="Send Message"
              title={
                isDisabled
                  ? "Enter a message or select an image and user"
                  : "Send message"
              }
            >
              {isSending ? (
                <p className=" text-white font-bold">
                  <ClipLoader color="white" size={28} />
                </p>
              ) : (
                <Image
                  src="/assets/images/send_button.svg"
                  width={30}
                  height={30}
                  alt={isSending ? "Sending..." : "send"}
                  className="rounded-full"
                />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
