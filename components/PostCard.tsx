"use client";

import { Post } from "@/types/post";
import { ClientDateTime } from "./ClientDateTime";
import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-slate-800 text-white p-5 rounded-xl shadow-lg">
      <div className="flex items-center mb-4">
        <Image
          src={post.author?.image ?? "/default-avatar.png"}
          alt={`${post.author?.name}'s avatar`}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full mr-4 border-2 border-slate-700"
        />
        <div>
          <p className="font-bold text-lg text-white">
            {post.author?.name || "Anonymous"}
          </p>
          <div className="text-xs text-slate-400">
            <ClientDateTime dateString={post.createdAt} />
          </div>
        </div>
      </div>

      {/* Display Post Content */}
      {post.content && (
        <p className="text-slate-300 whitespace-pre-wrap mb-4">
          {post.content}
        </p>
      )}

      {/* --- ADD THIS SECTION TO DISPLAY THE IMAGE --- */}
      {post.imageUrl && (
        <div className="my-4 -mx-5">
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={800}
            height={600}
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
      )}
      {/* ------------------------------------------- */}

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700 text-slate-400">
        <button className="hover:text-blue-500 transition-colors">
          {post.likes.length} Likes
        </button>
        <button className="hover:text-blue-500 transition-colors">
          {post.comments.length} Comments
        </button>
        <Link
          href={`/posts/${post.id}`}
          className="hover:text-blue-500 font-semibold transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
