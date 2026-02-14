export default function TrailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-9 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="flex justify-between mb-3">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-4" />
                  <div className="flex gap-4">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
