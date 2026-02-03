export default function TableLoading({ cols = 4, rows = 5 }) {
  // Retornamos un fragmento para que pueda ser insertado directamente en <tbody>
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => {
        // Cálculo de delay para efecto cascada (staggered)
        const delay = `${rowIndex * 100}ms`;
        
        return (
          <tr 
            key={`loading-row-${rowIndex}`} 
            className="border-b border-gray-100 last:border-0 animate-pulse"
            style={{ animationDelay: delay, animationFillMode: 'both' }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={`loading-cell-${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                <div
                  // Más alto (h-5/h-6), más redondeado (rounded-full), más contraste (bg-gray-200)
                  className="h-5 bg-gray-300 rounded-full relative overflow-hidden"
                  style={{ 
                    width: `${((colIndex % 3) + 2) * 20}%`,
                    opacity: 0.7 
                  }}
                >
                    {/* Efecto de brillo (shimmer) sutil */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                </div>
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
}
