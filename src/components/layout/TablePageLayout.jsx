import React from 'react';

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
    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                    )}
                </div>
                {action && (
                    <div className="flex-shrink-0">
                        {action}
                    </div>
                )}
            </div>

            {/* Main Content Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                {children}
            </div>
        </div>
    );
}
