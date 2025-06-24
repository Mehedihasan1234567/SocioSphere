// components/CommentBox.tsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Comment } from "@/types/Comment";
import Image from "next/image";

interface CommentBoxProps {
  postId: string;
  onCommentPosted: (newComment: Comment) => void;
}

export default function CommentBox({
  postId,
  onCommentPosted,
}: CommentBoxProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;
    setIsSubmitting(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, postId }),
    });

    if (res.ok) {
      const newComment = await res.json();
      onCommentPosted(newComment); // Pass new comment to parent
      setContent("");
    }
    setIsSubmitting(false);
  };

  if (!session) return null;

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg mt-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <Image
            width={44}
            height={44}
            src={session?.user?.image ?? "/default-avatar.png"}
            alt="Your avatar"
            className="w-11 h-11 rounded-full"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg border-2 border-transparent focus:border-blue-500 focus:bg-slate-800 focus:outline-none transition-all"
            rows={2}
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-5 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Posting..." : "Comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
