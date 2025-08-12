// components/SafeImage.tsx
'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function SafeImage({ 
  src, 
  alt, 
  className = '',
  fallback = 'https://via.placeholder.com/1920x1080/cccccc/666666?text=Imagem+não+disponível'
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <div className={`${className} bg-gray-200 animate-pulse`} />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : ''}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImgSrc(fallback);
          setLoading(false);
        }}
      />
    </>
  );
}