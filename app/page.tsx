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
import ProfileUpdate from "./components/ProfileUpdate";
import socket from "@/utils/socket";

interface User {
  _id?: string;
  [key: string]: any;
}
interface SendMessagePayload {
  sender: string | undefined;
  receiver: string | undefined;
  text: string;
}

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState<User>({});
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [unSeenMessages, setUnSeenMessages] = useState<Record<string, number>>(
    {}
  );
  const [isSending, setIsSending] = useState(false);
  const [isProfileUpdate, setProfileUpdate] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [typing, setTyping] = useState<string | null>(null);
  const [sendMessage] = useSendMessageMutation();
  const { data: userList, refetch: refetchUserList } = useGetUserQuery({});
  const { data: Profile, refetch: refetcProfile } = useGetProfileQuery({});
  const { data: messageData, refetch } = useGetMessageQuery({
    id: selectedUser?._id,
  });


  useEffect(() => {
    if (messageData?.messages) {
      setMessages(messageData.messages);
    } else {
      setMessages([]);
    }
  }, [messageData]);

  const handleSendMessage = async () => {
    if (!text.trim() && !imageFile) return;

    setIsSending(true);

    try {
      // 🖼️ If image is selected (with or without text), send via API (FormData)
      if (imageFile) {
        const formData = new FormData();
        {
          text.trim() && formData.append("text", text.trim());
        }

        formData.append("image", imageFile);

        const res = await sendMessage({
          userData: formData,
          receiverId: selectedUser._id,
        }).unwrap();

        console.log(res, "res");
        if (res.success) {
          socket.emit("send-message", {
            sender: Profile?.user?._id,
            receiver: selectedUser._id,
            text: res.data.text || "",
            image: res.data.image, // URL returned from backend
          });
        }
      } else {
        // 📝 No image, only text — use socket directly
        const message = {
          sender: Profile?.user?._id,
          receiver: selectedUser._id,
          text: text.trim(),
          image: "",
        };

        socket.emit("send-message", message);
        // setMessages((prev) => [...prev, message]);
      }
    } catch (err) {
      console.error("Send failed", err);
      toast.error("Message send failed.");
    }

    setText("");
    setImageFile(null);
    setIsSending(false);
  };

  useEffect(() => {
    if (Profile?.user?._id) {
      socket.connect();
      socket.emit("register", Profile.user._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [Profile?.user?._id]);

  useEffect(() => {
    const handleInitialOnlineUsers = (userIds: string[]) => {
      setOnlineUsers(userIds);
    };

    socket.on("initial-online-users", handleInitialOnlineUsers);

    return () => {
      socket.off("initial-online-users", handleInitialOnlineUsers);
    };
  }, []);

  useEffect(() => {
    const handleUserStatus = ({
      userId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
    }) => {
      console.log("User status changed:", userId, isOnline);
      setOnlineUsers((prev) => {
        if (isOnline && !prev.includes(userId)) {
          return [...prev, userId];
        } else if (!isOnline && prev.includes(userId)) {
          return prev.filter((id) => id !== userId);
        }
        return prev;
      });
    };

    socket.on("user-status", handleUserStatus);

    return () => {
      socket.off("user-status", handleUserStatus);
    };
  }, []);

  useEffect(() => {
    const handleUnseenUpdate = ({
      senderId,
      receiverId,
    }: {
      senderId: string;
      receiverId: string;
    }) => {
      if (receiverId === Profile?.user?._id) {
        setUnSeenMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    socket.on("unseen-message", handleUnseenUpdate);

    return () => {
      socket.off("unseen-message", handleUnseenUpdate);
    };
  }, [Profile?.user?._id, messages]);

  useEffect(() => {
    const handleReceive = (msg: any) => {
      const isCurrentChat = msg.senderId === selectedUser?._id;

      if (isCurrentChat && msg.receiverId === Profile?.user?._id) {
        const seenMessage = { ...msg, seen: true };

        setMessages((prev) => [...prev, seenMessage]);

        socket.emit("mark-seen", {
          senderId: msg.senderId,
          receiverId: msg.receiverId,
        });

        setUnSeenMessages((prev) => {
          const updated = { ...prev };
          delete updated[msg.senderId];
          return updated;
        });
      } else {
        // Not the current chat: count as unseen
        setUnSeenMessages((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    };

    const handleSent = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handleReceive);
    socket.on("message-sent", handleSent);

    socket.on("typing", ({ from }) => {
      if (from === selectedUser?._id) {
        setTyping("Typing...");
        setTimeout(() => setTyping(null), 2000);
      }
    });

    return () => {
      socket.off("receive-message", handleReceive);
      socket.off("message-sent", handleSent);
    };
  }, [Profile?.user?._id, selectedUser?._id]);

  useEffect(() => {
    if (selectedUser?._id && Profile?.user?._id) {
      socket.emit("mark-seen", {
        senderId: selectedUser._id,
        receiverId: Profile.user._id,
      });

      // ✅ Clear unseen count for selected user
      setUnSeenMessages((prev) => {
        const updated = { ...prev };
        if (selectedUser._id !== undefined) {
          delete updated[selectedUser._id];
        }
        return updated;
      });
    }
  }, [selectedUser?._id]);

  // Typing event
  const handleTyping = (): void => {
    if (selectedUser)
      socket.emit("typing", { from: Profile?.user?._id, to: selectedUser._id });
  };

  useEffect(() => {
    if (userList?.unseenMessages) {
      setUnSeenMessages(userList?.unseenMessages || {});
    }

    refetcProfile();
    refetchUserList();

    socket.on("messages-seen", ({ by }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiverId === by ? { ...msg, seen: true } : msg
        )
      );
    });

    return () => {
      socket.off("messages-seen");
    };
  }, [userList?.unseenMessages]);

  useEffect(() => {
    refetch();
  }, [selectedUser?._id]);

  return (
    <div className="w-full h-screen flex items-center justify-center inset-0 z-0 bg-black/5 backdrop-blur-md">
      <div className="h-[80vh] w-[80vw] flex border-2 border-gray-600 shadow-md rounded-lg overflow-hidden">
        <div className={`${selectedUser?._id ? "w-[25%]" :"w-[50%]" }  text-white`}>
          <UserSideBar
            userList={userList}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
            Profile={Profile}
            onlineUsers={onlineUsers}
            unSeenMessages={unSeenMessages}
            setProfileUpdate={setProfileUpdate}
          />
        </div>
        <div className={`${selectedUser?._id ? "w-[50%]" :"w-[50%]" }  text-white`}>
          {isProfileUpdate === 0 ? (
            <ChatBox
              selectedUser={selectedUser}
              handleSendMessage={handleSendMessage}
              setText={setText}
              text={text}
              messages={messages}
              currentUserId={Profile?.user?._id}
              isSending={isSending}
              handleTyping={handleTyping}
              typing={typing}
              setImageFile={setImageFile}
              imageFile={imageFile}
              onlineUsers={onlineUsers}
              setProfileUpdate={setProfileUpdate}
            />
          ) : (
            <ProfileUpdate setProfileUpdate={setProfileUpdate} Profile={Profile}/>
          )}
        </div>
        {
          selectedUser?._id && (
            <div className="w-[25%] text-white">
              <ProfileSidebar
                selectedUser={selectedUser}
                messages={messages}

              />
            </div>
          )
        }

      </div>
    </div>
  );
}
