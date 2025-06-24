// components/EditProfileModal.tsx
"use client";

import { useState, useRef } from "react";
import { UserProfile } from "@/types/UserProfile";
import {
  upload,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import Image from "next/image";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onProfileUpdate: (updatedUser: Partial<UserProfile>) => void;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  user,
  onProfileUpdate,
}: EditProfileModalProps) => {
  const [name, setName] = useState(user.name || "");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log("✅ 1. File selected:", selectedFile.name, selectedFile.type);
      setFile(selectedFile);
    }
  };

  const authenticator = async () => {
    try {
      console.log("...Attempting to fetch from /api/upload-auth");
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        throw new Error(
          `Authentication request failed with status ${response.status}`
        );
      }
      const data = await response.json();
      console.log("✅ 3. Authenticator success. Received token:", data.token);
      return data;
    } catch (error) {
      console.error("❌ 3. Authenticator FAILED:", error);
      throw error; // Re-throw the error to be caught by handleSubmit
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ 2. handleSubmit triggered.");
    setIsSubmitting(true);
    setError("");
    setProgress(0);

    let imageUrl = user.image;

    if (file) {
      console.log("...A new file is present. Proceeding with upload...");
      try {
        const authParams = await authenticator();

        console.log("...Calling ImageKit upload function.");
        const uploadResponse = await upload({
          file,
          fileName: file.name,
          folder: "/social-app-avatars",
          ...authParams,
          onProgress: (event) =>
            setProgress(Math.round((event.loaded / event.total) * 100)),
        });

        console.log("✅ 4. ImageKit upload SUCCESS:", uploadResponse);
        imageUrl = uploadResponse.url;
      } catch (uploadError) {
        let message = "Could not upload image.";
        if (uploadError instanceof ImageKitServerError)
          message = uploadError.message;
        console.error("❌ 4. ImageKit upload FAILED:", uploadError);
        setError(message);
        setIsSubmitting(false);
        return;
      }
    } else {
      console.log("...No new file selected. Skipping upload.");
    }

    try {
      console.log("...Attempting to save profile with data:", {
        name,
        image: imageUrl,
      });
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl }),
      });

      if (!res.ok) throw new Error("Failed to update profile.");

      const updatedUser = await res.json();
      console.log("✅ 5. Profile saved successfully!");
      onProfileUpdate(updatedUser);
      onClose();
    } catch (saveError) {
      console.error("❌ 5. Profile save FAILED:", saveError);
      setError("Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of your JSX code remains the same
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 text-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        {error && (
          <p className="text-red-500 bg-red-100/10 p-3 rounded-md mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700 p-3 rounded-lg border-2 border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <Image
                width={64}
                height={64}
                // This shows the new image preview instantly!
                src={
                  file
                    ? URL.createObjectURL(file)
                    : user.image ?? "/default-avatar.png"
                }
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Change
              </button>
            </div>
          </div>

          {isSubmitting && file && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-300">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg disabled:bg-slate-600"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; // Add default export
