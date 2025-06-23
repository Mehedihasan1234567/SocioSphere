// components/PostPageSkeleton.tsx
export const PostPageSkeleton = () => {
  return (
    <div className="container mx-auto max-w-3xl p-4 animate-pulse">
      {/* Main Post Skeleton */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 bg-slate-700 rounded-full mr-4"></div>
          <div>
            <div className="h-5 bg-slate-700 rounded w-40 mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-24"></div>
          </div>
        </div>
        <div className="space-y-3 mb-5">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
        <div className="flex justify-start space-x-8">
          <div className="h-6 w-20 bg-slate-700 rounded"></div>
          <div className="h-6 w-20 bg-slate-700 rounded"></div>
        </div>
      </div>

      {/* Comments Skeleton */}
      <div className="mt-8">
        <div className="h-7 w-48 bg-slate-700 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-start space-x-3 bg-slate-800 p-4 rounded-xl"
            >
              <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                <div className="h-4 bg-slate-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
