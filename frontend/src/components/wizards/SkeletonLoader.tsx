'use client';

export default function SkeletonLoader() {
  return (
    <div className="rounded-xl border border-slate-200 p-6 bg-white">
      {/* Badge Skeleton */}
      <div className="inline-block mb-4">
        <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse"></div>
      </div>

      {/* Title Skeleton */}
      <div className="h-5 w-3/4 bg-slate-200 rounded mb-3 animate-pulse"></div>

      {/* Description Skeleton - 3 lines */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 w-4/5 bg-slate-200 rounded animate-pulse"></div>
      </div>

      {/* Meta info Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
