import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 8 }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {/* Table Header Skeleton */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-300 rounded w-32"></div>
            <div className="flex space-x-3">
              <div className="h-4 bg-slate-300 rounded w-24"></div>
              <div className="h-4 bg-slate-300 rounded w-20"></div>
              <div className="h-4 bg-slate-300 rounded w-28"></div>
            </div>
          </div>
        </div>
        
        {/* Table Rows Skeleton */}
        <div className="divide-y divide-slate-200">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-300 rounded w-48"></div>
                  <div className="h-3 bg-slate-200 rounded w-64"></div>
                </div>
                <div className="flex space-x-8 items-center">
                  <div className="h-3 bg-slate-300 rounded w-16"></div>
                  <div className="h-6 bg-slate-300 rounded-full w-20"></div>
                  <div className="h-3 bg-slate-300 rounded w-24"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-slate-300 rounded"></div>
                    <div className="h-8 w-8 bg-slate-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;