// components/ui/Skeleton.tsx
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx('skeleton', className)} />;
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-sm border border-[#e5e0d8] overflow-hidden">
      <Skeleton className="w-full h-44" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="bg-white rounded-sm border border-[#e5e0d8] overflow-hidden mb-10">
      <Skeleton className="w-full h-72 md:h-96" />
      <div className="p-7 space-y-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-sm border border-[#e5e0d8] p-6 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
