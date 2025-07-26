"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import InputFeild from "./InputFeild";

interface Message {
  senderId: string;
  text?: string;
  image?: string;
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
}

const ChatBox: React.FC<ChatBoxProps> = ({
  selectedUser,
  handleSendMessage,
  setText,
  text,
  messages,
  currentUserId,
  isSending = false,
}) => {
  const isDisabled = !text.trim() || !selectedUser?._id || isSending;

  // 🔽 Ref to auto-scroll to bottom
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
          <h2 className="text-lg font-semibold mt-2">
            {selectedUser?.fullName || "Select a user"}
          </h2>
        </div>
        <Image
          src="/assets/images/help_icon.png"
          width={20}
          height={20}
          alt="help"
          className="rounded-full mt-2 w-5 h-5"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto AtScrollHide py-10 mt-4 space-y-2 px-1 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.length > 0 ? (
          <>
            {messages.map((msg, idx) => {
              const isSender = msg.senderId === currentUserId;
              return (
                <div
                  key={idx}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`w-fit max-w-[70%] p-2 rounded-2xl ${
                      isSender
                        ? "bg-purple-600 text-right"
                        : "bg-gray-700 text-left"
                    }`}
                  >
                    {msg.text && <p>{msg.text}</p>}
                    {msg.image && (
                      <Image
                        src={msg.image}
                        alt="attachment"
                        width={200}
                        height={200}
                        className="rounded-xl mt-2"
                      />
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={endOfMessagesRef} />
          </>
        ) : (
          <p className="text-gray-400 text-center">No messages yet</p>
        )}
      </div>

      {/* Message Input */}
      <div className="flex items-center gap-2 relative bottom-0 w-full">
        <div className="w-full">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full py-2 px-3 my-3 mt-5 border-2 bg-black/15 backdrop-blur-lg border-gray-500 rounded-2xl focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
            placeholder="Send a message..."
            disabled={isSending || !selectedUser?._id}
          />
        </div>

        <button
          className={`cursor-pointer hover:opacity-90 ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSendMessage}
          disabled={isDisabled}
          aria-label="Send Message"
          title={
            isDisabled ? "Enter a message and select a user" : "Send message"
          }
        >
          <Image
            src="/assets/images/send_button.svg"
            width={30}
            height={30}
            alt={isSending ? "Sending..." : "send"}
            className="rounded-full mt-2"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
