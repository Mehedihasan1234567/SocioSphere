"use client";
import { Post } from "@/types/post";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }: { post: Post }) {
  console.log("Rendering PostCard for post:", post.author.image);
  return (
    <div className="bg-slate-800 text-white p-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-500/20">
      <div className="flex items-center mb-4">
        <Image
          src={post.author?.image ?? "/default-avatar.png"}
          width={48}
          height={48}
          alt={`${post.author?.name}'s avatar`}
          className="w-12 h-12 rounded-full mr-4 border-2 border-slate-700"
        />
        <div>
          <p className="font-bold text-lg text-white">
            {post.author?.name ?? "Anonymous"}
          </p>
          <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
        </div>
      </div>
      <p className="text-slate-300 whitespace-pre-wrap mb-4">{post.content}</p>
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
