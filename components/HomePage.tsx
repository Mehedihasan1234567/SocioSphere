"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import CreatePostForm from "@/components/CreatePostForm";
import { PostCardSkeleton } from "@/components/PostCardSkeleton";
import { Post } from "@/types/post";
import { LeftSideBar } from "./LeftSideBar";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handlePostCreated = (newPost: Post) => {
    // Add the new post to the top of the list for an instant update
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <main className="bg-slate-900 min-h-screen">
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* -- LEFT SIDEBAR -- */}
        <LeftSideBar />

        {/* -- MAIN FEED -- */}
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold mb-6 text-white">Home Feed</h1>
          <CreatePostForm onPostCreated={handlePostCreated} />

          <div className="space-y-4">
            {loading ? (
              <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
