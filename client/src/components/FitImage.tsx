import type { CSSProperties, ImgHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type FitImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "className"> & {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Frame that always shows the whole photo (object-fit: contain). Any space the photo's
 * shape leaves in the frame is filled with a blurred copy of the same photo, so frames
 * can keep a consistent layout without cropping heads or edges.
 */
export function FitImage({ src, alt, className, children, ...imgProps }: FitImageProps) {
  return (
    <div className={cn("fit-image", className)} style={{ "--fit-image-src": `url("${src}")` } as CSSProperties}>
      <img src={src} alt={alt} className="fit-image__img" {...imgProps} />
      {children}
    </div>
  );
}
