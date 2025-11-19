
// components/SectionHeader.tsx
import React from 'react';

interface SectionHeaderProps {
  title: string;
  count?: string | number;
  className?: string;
  children?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = React.memo(({ title, count, className, children }) => (
  <div className={`relative bg-slate-800 text-white font-bold py-1.5 px-4 mt-4 mb-2 shadow-sm flex justify-between items-center rounded-sm uppercase tracking-wider text-sm ${className || ''}`}>
    <h3 className="relative z-10 flex-grow">{title}</h3>
    {children}
    {count !== undefined && (
      <span className="text-xs font-bold bg-slate-700 px-2 py-0.5 rounded-full border border-white/20 ml-2">
        {count}
      </span>
    )}
  </div>
));

export default SectionHeader;
