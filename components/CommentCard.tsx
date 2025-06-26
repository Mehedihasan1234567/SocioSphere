"use client";
import { Comment } from "@/types/Comment";
import { ClientDateTime } from "./ClientDateTime";
import Image from "next/image";

export const CommentCard = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex items-start space-x-3">
      <Image
        src={comment.author?.image ?? "/default-avatar.png"}
        alt="avatar"
        width={32}
        height={32}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1 bg-slate-700/50 rounded-lg p-3">
        <div className="flex items-baseline space-x-2">
          <p className="font-semibold text-sm text-white">
            {comment.author?.name}
          </p>
          <p className="text-xs text-slate-400">
            <ClientDateTime dateString={comment.createdAt} />
          </p>
        </div>
        <p className="text-slate-300 text-sm">{comment.content}</p>
      </div>
    </div>
  );
};
