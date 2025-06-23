// components/CreatePostForm.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Post } from "@/types/post";
import Image from "next/image";

interface CreatePostFormProps {
  onPostCreated: (newPost: Post) => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;
    setSubmitting(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const newPostData = await res.json();
      // Attach author info from session for instant display
      const newPostWithAuthor = {
        ...newPostData,
        author: { name: session.user?.name, image: session.user?.image },
        likes: [],
        comments: [],
      };
      onPostCreated(newPostWithAuthor);
      setContent("");
    }
    setSubmitting(false);
  };

  if (!session) return null;

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <Image
            src={session.user?.image ?? "/default-avatar.png"}
            width={48}
            height={48}
            alt="Your avatar"
            className="w-12 h-12 rounded-full"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's happening, ${session.user?.name}?`}
            className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg border-2 border-transparent focus:border-blue-500 focus:bg-slate-800 focus:outline-none transition-all"
            rows={3}
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
