export default function SweetSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>

        <div className="flex justify-between pt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}