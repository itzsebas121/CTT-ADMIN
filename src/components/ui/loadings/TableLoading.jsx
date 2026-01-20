export default function TableLoading() {
  return (
    <div className="flex flec-row gap-2">
      <div className="flex flex-row gap-2">
        <div className="flex flex-col gap-2">
          <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
          <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col gap-2">
          <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
          <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col gap-2">
          <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
          <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
