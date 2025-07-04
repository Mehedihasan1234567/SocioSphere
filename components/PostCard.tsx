"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { Post } from "@/types/post";
import { Comment } from "@/types/Comment";
import { ClientDateTime } from "./ClientDateTime";
import { CommentCard } from "./CommentCard";
import { AtSign, Hash, MessageCircle, Send, Smile } from "lucide-react";
import { UserAvatar } from "./UserAvater";

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

export default function PostCard({ post }: { post: Post }) {
  const { data: session } = useSession();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Enhanced comment input states
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showEmojiHint, setShowEmojiHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxChars = 500;

  useEffect(() => {
    if (session?.user?.id) {
      setIsLiked(post.likes.some((like) => like.userId === session.user.id));
    }
  }, [post.likes, session]);

  useEffect(() => {
    setCharCount(commentContent.length);
  }, [commentContent]);

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

  const handleCommentSubmit = async () => {
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
        setIsFocused(false);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue =
      commentContent.slice(0, start) + text + commentContent.slice(end);
    setCommentContent(newValue);

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [commentContent]);

  return (
    <div className="bg-slate-800 text-white rounded-2xl shadow-lg border border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-5">
        <UserAvatar userId={post.author.id} size={48} />
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

      {/* Action Buttons */}
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
          <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-sm">
            {comments.length} Comments
          </span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-5 py-4 border-t border-slate-700/50">
          {session && (
            <div className="mb-6">
              {/* Enhanced Comment Input */}
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50">
                <div className="flex items-start space-x-3">
                  <UserAvatar userId={session.user.id} size={48} />

                  <div className="flex-1 space-y-3">
                    <div className="relative">
                      <div
                        className={`relative transition-all duration-300 ${
                          isFocused
                            ? "ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20"
                            : ""
                        }`}
                      >
                        <textarea
                          ref={textareaRef}
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          onKeyDown={handleKeyDown}
                          placeholder="What's on your mind? Share your thoughts..."
                          className={`w-full bg-slate-700/70 text-white p-3 rounded-xl border-2 transition-all duration-300 resize-none overflow-hidden min-h-[60px] placeholder-slate-400 ${
                            isFocused
                              ? "border-blue-500 bg-slate-700/90"
                              : "border-slate-600 hover:border-slate-500"
                          } focus:outline-none`}
                          style={{ fontFamily: "inherit" }}
                        />

                        {/* Floating action buttons */}
                        <div
                          className={`absolute right-2 top-2 flex gap-1 transition-opacity duration-300 ${
                            isFocused
                              ? "opacity-100"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => insertText("😊")}
                            onMouseEnter={() => setShowEmojiHint(true)}
                            onMouseLeave={() => setShowEmojiHint(false)}
                            className="p-1.5 text-slate-400 hover:text-yellow-400 hover:bg-slate-600/50 rounded-lg transition-all duration-200 relative"
                          >
                            <Smile size={14} />
                            {showEmojiHint && (
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-xs text-white px-2 py-1 rounded whitespace-nowrap z-20">
                                Add emoji
                              </div>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => insertText("@")}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
                          >
                            <AtSign size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertText("#")}
                            className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
                          >
                            <Hash size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Character counter */}
                      <div
                        className={`text-right mt-1 text-xs transition-colors duration-300 ${
                          charCount > maxChars * 0.8
                            ? charCount > maxChars
                              ? "text-red-400"
                              : "text-yellow-400"
                            : "text-slate-500"
                        }`}
                      >
                        {charCount}/{maxChars}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                          Ctrl
                        </kbd>
                        <span>+</span>
                        <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                          Enter
                        </kbd>
                        <span>to post</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCommentSubmit}
                        disabled={
                          !commentContent.trim() ||
                          isSubmittingComment ||
                          charCount > maxChars
                        }
                        className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform ${
                          !commentContent.trim() ||
                          isSubmittingComment ||
                          charCount > maxChars
                            ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95"
                        } flex items-center gap-2`}
                      >
                        {isSubmittingComment ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send
                              size={14}
                              className="group-hover:translate-x-0.5 transition-transform duration-200"
                            />
                            Comment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tips (only show when focused) */}
              {isFocused && (
                <div className="mt-3 p-3 bg-slate-700/20 rounded-lg border border-slate-600/30 transition-all duration-300">
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <span>💡</span>
                      <span>
                        Use @ to mention • # for hashtags • Be respectful and
                        constructive
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-8 bg-slate-700/20 rounded-lg border border-slate-600/30">
                💬 Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
