interface SkeletonProps {
  count?: number
  className?: string
}

export function Skeleton({ count = 1, className = 'h-24 w-full' }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} aria-busy="true" className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
      ))}
    </>
  )
}
