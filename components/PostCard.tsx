"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { Post } from "@/types/post";
import { Comment } from "@/types/Comment";
import { ClientDateTime } from "./ClientDateTime";
import { CommentCard } from "./CommentCard";

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-6 h-6 ${
      filled ? "text-red-500 fill-red-500" : "text-slate-400"
    }`}
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
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

export default function PostCard({ post }: { post: Post }) {
  const { data: session } = useSession();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Check if current user has liked this post
  useEffect(() => {
    if (session?.user?.id) {
      setIsLiked(post.likes.some((like) => like.userId === session.user.id));
    }
  }, [post.likes, session]);

  // --- HANDLER FUNCTIONS ---

  const handleLike = async () => {
    if (!session) return signIn();
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
    } catch (error) {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error("Failed to toggle like:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !session) return;
    setIsSubmittingComment(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent, postId: post.id }),
      });

      if (res.ok) {
        const newComment: Comment = await res.json();

        setComments((prevComments) => [newComment, ...prevComments]);
        setCommentContent("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="bg-slate-800 text-white rounded-2xl shadow-lg border border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-5">
        <Image
          src={post.author?.image ?? "/default-avatar.png"}
          alt={`${post.author?.name}'s avatar`}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full border-2 border-slate-600"
        />
        <div className="ml-4">
          <p className="font-bold text-lg text-white">
            {post.author?.name ?? "Anonymous"}
          </p>
          <div className="text-xs text-slate-400">
            <ClientDateTime dateString={post.createdAt} />
          </div>
        </div>
      </div>

      {/* Content and Image */}
      <div className="px-5 pb-4">
        {post.content && (
          <p className="text-slate-200 whitespace-pre-wrap">{post.content}</p>
        )}
        {post.imageUrl && (
          <div className="mt-4 rounded-xl overflow-hidden">
            <Link href={`/posts/${post.id}`}>
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </Link>
          </div>
        )}
      </div>

      <div className="flex justify-around items-center px-5 py-3 border-t border-slate-700/50 bg-slate-800/30">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors"
        >
          <HeartIcon filled={isLiked} />
          <span className="font-medium text-sm">{likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <CommentIcon />
          <span className="font-medium text-sm">
            {comments.length} Comments
          </span>
        </button>
      </div>

      {showComments && (
        <div className="px-5 py-4 border-t border-slate-700/50">
          {session && (
            <form
              onSubmit={handleCommentSubmit}
              className="flex items-start space-x-3 mb-4"
            >
              <Image
                src={session.user.image ?? "/default-avatar.png"}
                alt="Your avatar"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full mt-1"
              />

              <div className="flex-1">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-slate-700/50 text-white p-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  rows={2}
                />
                <div className="text-right mt-2">
                  <button
                    type="submit"
                    disabled={!commentContent.trim() || isSubmittingComment}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-1 px-4 rounded-md disabled:bg-slate-600"
                  >
                    {isSubmittingComment ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">
                Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
