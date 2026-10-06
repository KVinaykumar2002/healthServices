/** Landscape photos already on the website that can be used in the home page hero without uploading. */
export const HERO_PHOTO_LIBRARY: { src: string; alt: string }[] = [
  {
    src: "/images/bhsk/hero-elderly-care.jpg",
    alt: "BHSK nurse supporting an elderly man in a wheelchair at home",
  },
  {
    src: "/images/bhsk/hero-mobility-family.jpg",
    alt: "BHSK nurse helping an elderly man walk with a frame while his family watches",
  },
  {
    src: "/images/bhsk/hero-family-bedside.jpg",
    alt: "BHSK nurse caring for an elderly patient in bed with his grandchildren beside him",
  },
  { src: "/images/bhsk/home-nursing-banner.jpg", alt: "BHSK nurse providing home nursing care in Doha" },
  { src: "/images/bhsk/services/home-nursing.jpg", alt: "BHSK nurse visiting a patient at home" },
  { src: "/images/bhsk/services/elderly-care.jpg", alt: "BHSK nurse caring for an elderly person at home" },
  { src: "/images/bhsk/services/post-operative.jpg", alt: "BHSK nurse helping a patient recover after surgery" },
  { src: "/images/bhsk/services/chronic-care.jpg", alt: "BHSK nurse supporting a patient with a long-term condition" },
  { src: "/images/bhsk/services/palliative-care.jpg", alt: "BHSK nurse providing comfort-focused palliative care" },
  { src: "/images/bhsk/services/physiotherapy.jpg", alt: "BHSK physiotherapy session at home" },
  { src: "/images/bhsk/services/maternity-newborn.jpg", alt: "BHSK nurse caring for a mother and newborn baby" },
  { src: "/images/bhsk/services/baby-care.jpg", alt: "BHSK nurse caring for a baby at home" },
  { src: "/images/bhsk/services/hospitals.jpg", alt: "BHSK nurses working in a hospital ward" },
  { src: "/images/bhsk/services/medical-centres.jpg", alt: "BHSK nurse at a medical centre reception" },
  { src: "/images/bhsk/services/schools-nurseries.jpg", alt: "BHSK school nurse caring for a child" },
  { src: "/images/bhsk/services/camp-construction.jpg", alt: "BHSK nurse providing first aid at a work site" },
];

const MAX_EDGE = 1920;
const JPEG_QUALITY = 0.85;

/**
 * Shrinks large photos (phone pictures are often 4000px+ and several MB) to at most 1920px
 * and re-encodes them as JPEG, which also strips location metadata from the camera.
 */
export async function prepareImageForUpload(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Couldn't read that file. Please choose a JPEG, PNG or WebP photo.");
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser couldn't process that photo.");

  // JPEG has no transparency; fill so transparent PNGs don't turn black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  if (!blob) throw new Error("Your browser couldn't process that photo.");
  return blob;
}
