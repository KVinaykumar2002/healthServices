import type { CSSProperties } from "react";

export interface LabTestsTileProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

const defaultImageSrc =
  "https://firstresponsehealthcare.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdbubjszto%2Fimage%2Fupload%2Ffrhstagingweb%2FLab_Tests_at_Home_8e9159a248.webp&w=640&q=75";

export function LabTestsTile({
  imageSrc = defaultImageSrc,
  imageAlt = "Lab Tests",
  className = "",
}: LabTestsTileProps) {
  const tileStyle: CSSProperties = {
    width: "316.4px",
    minHeight: "423px",
  };

  return (
    <article
      className={`flex h-[423px] flex-col justify-end overflow-hidden rounded-[18px] bg-gradient-to-b from-[#E93939] to-[#FFE3C2]/10 md:h-full ${className}`}
      style={tileStyle}
      aria-label={imageAlt}
    >
      <img
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        width={300}
        height={300}
        className="mx-auto block w-full object-cover"
        src={imageSrc}
      />
    </article>
  );
}
