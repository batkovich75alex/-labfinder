export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-[#E4E7EC] bg-white p-5">
      <div className="flex gap-4">
        <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-[#F2F4F7]" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-[#F2F4F7]" />
          <div className="h-3 w-1/2 rounded bg-[#F2F4F7]" />
          <div className="h-3 w-2/3 rounded bg-[#F2F4F7]" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-[#F2F4F7]" />
          <div className="h-8 w-24 rounded bg-[#F2F4F7]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}