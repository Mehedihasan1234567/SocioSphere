export const PostCardSkeleton = () => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-slate-700 rounded-full mr-3"></div>
        <div>
          <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-32"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
        <div className="h-6 w-20 bg-slate-700 rounded"></div>
        <div className="h-6 w-20 bg-slate-700 rounded"></div>
        <div className="h-6 w-20 bg-slate-700 rounded"></div>
      </div>
    </div>
  );
};
