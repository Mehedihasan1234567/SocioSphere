"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Post } from "@/types/post";
import { upload } from "@imagekit/next";
import { UserAvatar } from "./UserAvater";

const ImageIcon = () => (
  <svg
    className="w-6 h-6 text-slate-400 hover:text-blue-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default function CreatePostForm({
  onPostCreated,
}: {
  onPostCreated: (newPost: Post) => void;
}) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth"); // We reuse the same auth endpoint
      if (!response.ok) throw new Error("Authentication failed");
      return await response.json();
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !file) || !session) return;

    setIsSubmitting(true);
    setError("");
    let imageUrl: string | null = null;

    if (file) {
      try {
        const authParams = await authenticator();
        const uploadResponse = await upload({
          file,
          fileName: file.name,
          folder: "/social-app-posts",
          ...authParams,
        });
        imageUrl = uploadResponse.url ?? null;
      } catch {
        setError("Image upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, imageUrl }),
    });

    if (res.ok) {
      const newPostData = await res.json();
      onPostCreated({
        ...newPostData,
        author: {
          name: session.user.name,
          image: session.user.image,
          id: session.user.id,
        },
        likes: [],
        comments: [],
      });
      setContent("");
      setFile(null);
    } else {
      setError("Failed to create post.");
    }
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  if (!session) return null;

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg mb-6">
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <UserAvatar userId={session.user.id} size={48} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's happening, ${session.user.name}?`}
            className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Image Preview Section */}
        {file && (
          <div className="mt-4 pl-16 relative">
            <Image
              src={URL.createObjectURL(file)}
              alt="Image preview"
              width={500}
              height={300}
              className="rounded-lg max-h-80 w-auto"
            />
            <button
              type="button"
              onClick={() => setFile(null)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-3 pl-16">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Add image"
          >
            <ImageIcon />
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />

          <button
            type="submit"
            disabled={(!content.trim() && !file) || isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
