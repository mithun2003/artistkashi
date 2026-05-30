import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

type ImageWithFallbackProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string;
  alt?: string;
};

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const { src, alt, style, className, width, height, fill, onError, ...rest } =
    props;

  const handleError: NonNullable<ImageProps["onError"]> = (event) => {
    setDidError(true);
    onError?.(event);
  };

  const resolvedSrc = didError ? ERROR_IMG_SRC : src || ERROR_IMG_SRC;
  const resolvedAlt = didError ? "Error loading image" : alt || "Image";

  const sizesProp = fill ? { sizes: rest.sizes ?? "100vw" } : {};

  return (
    <Image
      src={resolvedSrc}
      alt={resolvedAlt}
      fill={fill}
      {...(!fill && { width: width ?? 1200, height: height ?? 900 })}
      {...sizesProp}
      className={className}
      style={style}
      data-original-url={didError ? src : undefined}
      {...rest}
      onError={handleError}
    />
  );
}
