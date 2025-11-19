import React, { useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, style, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Resetar estado de carregamento se a fonte mudar (ex: trocar para shiny)
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={`relative inline-block ${className || ''}`} style={style}>
      {/* Skeleton Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg z-0" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`block w-full h-full object-contain transition-opacity duration-500 ease-out relative z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;