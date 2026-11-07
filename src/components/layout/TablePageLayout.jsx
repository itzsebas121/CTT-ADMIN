import React from 'react';
import { useDashboardTheme } from '../../context/DashboardThemeContext';

/**
 * TablePageLayout - A reusable layout for pages that display a table.
 * 
 * @param {Object} props
 * @param {string} props.title - The main title of the page.
 * @param {string} [props.description] - A brief description or subtitle.
 * @param {React.ReactNode} [props.action] - An optional action element (e.g., a "Create" button) to display in the header.
 * @param {React.ReactNode} props.children - The main content (usually the Table component).
 */
export default function TablePageLayout({ title, description, action, children }) {
  const { isDark } = useDashboardTheme();

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border transition-colors ${
          isDark
            ? 'bg-[#16161a] border-white/[0.08] shadow-sm text-white'
            : 'bg-white border-black/[0.08] shadow-xs text-zinc-900'
        }`}
      >
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {title}
          </h1>
          {description && (
            <p className={`text-xs mt-1 font-normal leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 self-start sm:self-auto">
            {action}
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
