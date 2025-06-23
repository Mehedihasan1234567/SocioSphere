import { PostCardSkeleton } from "./PostCardSkeleton";

export const UserProfileSkeleton = () => {
  return (
    <main className="bg-slate-900 min-h-screen text-white">
      <div className="container mx-auto p-4 max-w-3xl animate-pulse">
        {/* Skeleton for Header Section */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-700"></div>
          <div>
            <div className="h-8 bg-slate-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-64"></div>
          </div>
        </div>

        {/* Skeleton for Posts Section */}
        <div>
          <div className="h-7 bg-slate-700 rounded w-56 mb-4"></div>
          <div className="space-y-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
};
