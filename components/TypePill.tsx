
// components/TypePill.tsx
import React from 'react';
import { typeStyles } from './PokemonTypeIcons.tsx';

interface TypePillProps {
    type: string;
    className?: string;
}

const TypePill: React.FC<TypePillProps> = React.memo(({ type, className }) => {
    const styleClass = typeStyles[type] || 'bg-gray-400 text-white';
    return (
        <span className={`px-3 py-0.5 text-xs font-bold shadow-sm capitalize rounded-full ${styleClass} ${className || ''}`}>
            {type}
        </span>
    );
});

export default TypePill;
