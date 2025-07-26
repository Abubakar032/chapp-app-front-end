"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  useGetMessageQuery,
  useGetProfileQuery,
  useGetUserQuery,
  useSendMessageMutation,
} from "./Redux/services/AuthApi";

import UserSideBar from "./components/UserSidebar";
import ProfileSidebar from "./components/ProfileSidebar";
import ChatBox from "./components/ChatBox";
import socket from "@/utils/socket";

interface User {
  _id?: string;
  [key: string]: any;
}

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState<User>({});
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [sendMessage] = useSendMessageMutation();
  const { data: userList } = useGetUserQuery({});
  const { data: Profile } = useGetProfileQuery({});
  const { data: messageData, refetch } = useGetMessageQuery({
    id: selectedUser?._id,
  });

  // Load messages when selectedUser or messageData changes
  useEffect(() => {
    if (messageData?.messages) {
      setMessages(messageData.messages);
    } else {
      setMessages([]);
    }
  }, [messageData, selectedUser]);

  // Join socket room once Profile.user._id is available
  useEffect(() => {
    if (Profile?.user?._id) {
      socket.emit("join", Profile.user._id);
      console.log("🔔 Emitting join for:", Profile.user._id);
    }
  }, [Profile]);

  useEffect(() => {
    const handleIncomingMessage = (newMessage: any) => {
      const senderId = newMessage?.senderId;
      const receiverId = newMessage?.receiverId;

      if (senderId === selectedUser?._id || receiverId === selectedUser?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receive-message", handleIncomingMessage);
    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, [selectedUser]); // ✅ only depends on selectedUser

  // Sending message handler
  const handleSendMessage = async () => {
    if (!text.trim() || !selectedUser?._id) return;

    setIsSending(true);

    const payload = {
      text,
      image: "",
    };

    try {
      const response = await sendMessage({
        receiverId: selectedUser._id,
        userData: payload,
      });

      if ("error" in response) {
        const errorMessage =
          (response.error as any)?.data?.message ||
          (response.error as any)?.message ||
          "An error occurred";
        toast.error(errorMessage);
      } else {
        const newMessage = response?.data?.data;
        setText("");

        // Emit message to socket server only
        socket.emit("send-message", newMessage);

        // ❌ Don't do this (causes double UI update)
        // setMessages((prev) => [...prev, newMessage]);
      }
    } catch (err) {
      toast.error("Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [selectedUser?._id]);

  return (
    <div className="w-full h-screen flex items-center justify-center inset-0 z-0 bg-black/5 backdrop-blur-md">
      <div className="h-[80vh] w-[80vw] flex border-2 border-gray-600 shadow-md rounded-lg overflow-hidden">
        <div className="w-[25%] text-white">
          <UserSideBar
            userList={userList}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        </div>
        <div className="w-[50%] text-white">
          <ChatBox
            selectedUser={selectedUser}
            handleSendMessage={handleSendMessage}
            setText={setText}
            text={text}
            messages={messages}
            currentUserId={Profile?.user?._id}
            isSending={isSending}
          />
        </div>
        <div className="w-[25%] text-white">
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
}
