export default function LinkedInSkeleton() {
  return (
    <div className="space-y-12 animate-pulse w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Experience Timeline Skeleton */}
        <div className="lg:col-span-2">
          <div className="h-4 w-32 bg-warm-border-light rounded-md mb-8" />
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-warm-border-light mt-1.5" />
                  <div className="w-[1px] flex-1 bg-warm-border-light my-1" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-warm-border-light rounded-md" />
                  <div className="h-3 w-32 bg-warm-border-light rounded-md opacity-60" />
                  <div className="h-3 w-24 bg-warm-border-light rounded-md opacity-40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Education Skeleton */}
        <div className="space-y-12">
          <div>
            <div className="h-4 w-32 bg-warm-border-light rounded-md mb-6" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-7 w-20 bg-warm-border-light rounded-full" />
              ))}
            </div>
          </div>
          <div>
            <div className="h-4 w-24 bg-warm-border-light rounded-md mb-6" />
            <div className="space-y-4">
              {[11, 12].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-40 bg-warm-border-light rounded-md" />
                  <div className="h-3 w-28 bg-warm-border-light rounded-md opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
