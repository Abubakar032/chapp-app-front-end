import React, { useState } from "react";
import InputFeild from "./InputFeild";
import { FaArrowLeft } from "react-icons/fa6";
import Button from "./Button";
import { useUpdateProfileMutation } from "../Redux/services/AuthApi";
import { toast } from "react-toastify";
import Image from "next/image";

const ProfileUpdate = ({ setProfileUpdate, Profile, setResponsiveTab, refetcProfile }: any) => {
  const [updateProfile] = useUpdateProfileMutation();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // For FormData

  const [formData, setFormData] = useState({
    fullName: Profile?.user?.fullName || "",
    email: Profile?.user?.email || "",
    bio: Profile?.user?.bio || "",
    image: Profile?.user?.profilImage || "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file)); // Just for preview
    }
  };

  // 📤 Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;

      if (imageFile) {
        const form = new FormData();
        form.append("fullName", formData.fullName);
        form.append("bio", formData.bio);
        form.append("profileImage", imageFile); // 👈 Actual file

        response = await updateProfile({ userData: form });
      } else {
        const payload = {
          fullName: formData.fullName,
          bio: formData.bio,
        };

        response = await updateProfile({ userData: payload });
      }

      if (response?.data?.user) {
        toast.success("Profile updated successfully");
        // setProfileUpdate(0);
        refetcProfile(); // Refetch profile data
      } else {
        toast.error("Profile update failed");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full h-full p-6 rounded-lg shadow-md relative text-gray-300 overflow-y-auto AtScrollHide ">
      {/* Back Button */}
      <div className="md:block  hidden">
      <button
        onClick={() => setProfileUpdate(0)}
        className="absolute gap-2 flex top-4 left-4 text-gray-300  cursor-pointer "
      >
        <p className="mt-1">
          <FaArrowLeft />
        </p>{" "}
        Back
      </button>
      </div>
       <button
        onClick={() => setResponsiveTab?.(0)}
        className="absolute gap-2 top-4 left-4 text-gray-300 md:hidden cursor-pointer flex"
      >
        <p className="mt-1">
          <FaArrowLeft />
        </p>{" "}
        Back
      </button>

      {/* Profile Image */}
      <div className="flex flex-col items-center mt-8">
        <h1 className=" mb-2 font-bold text-2xl">Profile</h1>
        <label htmlFor="image-upload" className="cursor-pointer">
          <Image
            src={
              profileImage
                ? profileImage
                : formData.image
                ? formData.image
                : "/assets/images/avatar_icon.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            width={128}
            height={128}
          />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <p className="mt-4 font-semibold text-lg">
          {formData.fullName || "Your Full Name"}
        </p>
        <p className="text-sm text-gray-300">
          {formData.bio || "Short bio here..."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 px-4 md:px-16">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <InputFeild
            type="text"
            className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
            placeholder="Full Name"
            value={formData.fullName}
            onchange={(e: any) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>

        {/* Email (Disabled, not editable) */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <InputFeild
            type="email"
            className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
            value={formData.email}
            disabled={true}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full py-2 px-3 my-3 mt-5 border-2 border-gray-500 rounded-md focus:border-4 focus:border-gray-500 focus:outline-none transition-all text-gray-300"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center w-full">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded-2xl cursor-pointer text-white">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
