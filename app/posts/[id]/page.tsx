"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

// Import types and components
import { Post } from "@/types/post";
import { Comment } from "@/types/Comment";
import { PostPageSkeleton } from "@/components/PostPageSkeleton";
import CommentBox from "@/components/CommentBox";
import { CommentCard } from "@/components/CommentCard";
import { ClientDateTime } from "@/components/ClientDateTime";
import Image from "next/image";

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-6 h-6 ${filled ? "text-red-500" : "text-slate-400"}`}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
    />
  </svg>
);
const CommentIcon = () => (
  <svg
    className="w-6 h-6 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

export default function PostPage() {
  const params = useParams();
  const { id: postId } = params;
  const { data: session } = useSession();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // Derived state for likes for easier handling
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (postId) {
      fetch(`/api/posts/${postId}`)
        .then((res) => res.json())
        .then((data: Post) => {
          setPost(data);
          setLikeCount(data.likes.length);
          // Check if the current user has liked this post
          if (session?.user?.id) {
            setIsLiked(
              data.likes.some((like) => like.userId === session?.user?.id)
            );
          }
        })
        .finally(() => setLoading(false));
    }
  }, [postId, session]);

  const handleLike = async () => {
    if (!session) return signIn();

    // Optimistic UI update
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
  };

  const handleCommentPosted = (newComment: Comment) => {
    setPost((prevPost) => {
      if (!prevPost) return null;
      // Add new comment to the list for instant UI update
      return {
        ...prevPost,
        comments: [newComment, ...prevPost.comments],
      };
    });
  };

  if (loading) return <PostPageSkeleton />;
  if (!post)
    return <div className="text-center text-white p-10">Post not found.</div>;

  return (
    <div className="container mx-auto max-w-3xl p-4 bg-slate-900 text-white min-h-screen">
      {/* Main Post Section */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
          <Image
            width={56}
            height={56}
            src={post.author?.image ?? "/default-avatar.png"}
            alt="avatar"
            className="w-14 h-14 rounded-full mr-4"
          />
          <div>
            <Link
              href={`/users/${post.author.id}`}
              className="font-bold text-xl hover:underline"
            >
              {post.author?.name}
            </Link>
            <p className="text-sm text-slate-400">
              <ClientDateTime dateString={post.createdAt} />
            </p>
          </div>
        </div>
        <p className="text-lg text-slate-200 whitespace-pre-wrap mb-5">
          {post.content}
        </p>
        <div className="flex items-center space-x-8 pt-3 border-t border-slate-700">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <HeartIcon filled={isLiked} />
            <span className="font-semibold">{likeCount}</span>
          </button>
          <div className="flex items-center space-x-2 text-slate-400">
            <CommentIcon />
            <span className="font-semibold">{post.comments.length}</span>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <CommentBox postId={post.id} onCommentPosted={handleCommentPosted} />

      {/* Comments List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({post.comments.length})
        </h2>
        <div className="space-y-4">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-slate-400 text-center py-8">
              No comments yet. Be the first to reply!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
