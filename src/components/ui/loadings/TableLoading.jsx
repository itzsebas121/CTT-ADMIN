export default function TableLoading({ cols = 4, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const delay = `${rowIndex * 80}ms`;
        
        return (
          <tr 
            key={`loading-row-${rowIndex}`} 
            className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 animate-pulse"
            style={{ animationDelay: delay, animationFillMode: 'both' }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={`loading-cell-${rowIndex}-${colIndex}`} className="px-5 py-4 whitespace-nowrap">
                <div
                  className="h-3.5 bg-zinc-200/80 dark:bg-white/[0.06] rounded-md relative overflow-hidden"
                  style={{ 
                    width: `${((colIndex % 3) + 2) * 20}%`,
                  }}
                >
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
}
