import React from 'react';

export default function TableLoading({ cols = 4, rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-lg overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex w-full bg-gray-50 border-b border-gray-100">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={`head-${i}`} className="p-4 flex-1">
            <div className="h-5 bg-gray-200 rounded w-2/3 shimmer-wrapper relative overflow-hidden"></div>
          </div>
        ))}
      </div>

      {/* Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex w-full border-b border-gray-50"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="p-4 flex-1">
              <div
                className="h-4 bg-gray-100 rounded w-full shimmer-wrapper relative overflow-hidden"
                style={{ width: `${Math.floor(Math.random() * (100 - 60 + 1)) + 60}%` }} // Random width for realism
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
