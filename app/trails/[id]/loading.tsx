export default function TrailDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
              <div>
                <div className="h-9 w-56 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mt-2" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map + description skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 bg-gray-200 animate-pulse" />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-6 w-28 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
