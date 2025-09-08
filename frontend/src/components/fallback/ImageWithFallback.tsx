"use client";

import React, { useState } from 'react';

// --- Mocks for Dependencies ---
// In a real app, this would be imported from Next.js. I've included a mock
// here to create a self-contained, runnable component and resolve the build error.
type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

const Image = (props: ImageProps) => {
    const { src, alt, ...rest } = props;
    // In a real Next.js app, this component would handle image optimization.
    // For this self-contained example, we'll use a standard <img> tag.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...rest} />;
};
// --- End Mocks ---


// The fallback image is a tiny, inline SVG, so it doesn't need optimization.
// Using a standard <img> tag here is perfectly fine.
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdWW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export function ImageWithFallback(props: ImageProps) {
  const { src, alt, className, ...rest } = props;
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  if (didError || !src) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        // Pass style through if it exists
        style={props.style}
      >
        <div className="flex items-center justify-center w-full h-full">
          {/* Using a standard img for the tiny fallback SVG is acceptable */}
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            width={props.width}
            height={props.height}
            data-original-url={src}
          />
        </div>
      </div>
    );
  }

  return (
    // Using the performant next/image component (mocked above) for the primary image
    <Image
      src={src}
      alt={alt}
      className={className}
      {...rest}
      onError={handleError}
    />
  );
}

