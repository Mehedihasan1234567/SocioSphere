import { Comment } from "@/types/Comment";
import { ClientDateTime } from "./ClientDateTime";
export const CommentCard = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex items-start space-x-4 bg-slate-800 p-4 rounded-xl">
      <img
        src={comment.author?.image ?? "/default-avatar.png"}
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <p className="font-bold text-white">{comment.author?.name}</p>
          <p className="text-xs text-slate-400">
            <ClientDateTime dateString={comment.createdAt} />
          </p>
        </div>
        <p className="text-slate-300">{comment.content}</p>
      </div>
    </div>
  );
};
