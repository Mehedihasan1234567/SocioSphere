"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";
import CreatePostForm from "@/components/CreatePostForm";
import { Post } from "@/types/post";
import { LeftSideBar } from "./LeftSideBar";

export default function HomePage({ serverPosts }: { serverPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(serverPosts);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <main className="bg-slate-900 min-h-screen">
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <LeftSideBar />

        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold mb-6 text-white">Home Feed</h1>
          <CreatePostForm onPostCreated={handlePostCreated} />

          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
