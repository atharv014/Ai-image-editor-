import { FilterState } from "../types";

/**
 * Draws the source image onto a canvas with the given CSS filters applied,
 * then returns the new image as a Base64 string.
 * This is crucial so the AI "sees" the brightness/contrast changes the user made.
 */
export const processImageWithFilters = (
  imageSrc: string,
  filters: FilterState
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Construct filter string
      // Note: order matters in CSS filters, let's stick to a standard order
      const filterString = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
        blur(${filters.blur}px)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
      `;

      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      try {
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
};

/**
 * Helper to download the current state
 */
export const downloadImage = (dataUrl: string, filename = "lumina-edit.png") => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
