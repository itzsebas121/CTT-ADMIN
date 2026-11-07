export default function TableLoading({ cols = 4, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const delay = `${rowIndex * 100}ms`;
        
        return (
          <tr 
            key={`loading-row-${rowIndex}`} 
            className="border-b border-inherit last:border-0 animate-pulse"
            style={{ animationDelay: delay, animationFillMode: 'both' }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={`loading-cell-${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                <div
                  className="h-4 bg-zinc-200 dark:bg-white/[0.06] rounded-md relative overflow-hidden"
                  style={{ 
                    width: `${((colIndex % 3) + 2) * 20}%`,
                    opacity: 0.7 
                  }}
                >
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
}
