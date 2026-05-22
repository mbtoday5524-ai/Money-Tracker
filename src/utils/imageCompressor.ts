export const compressImage = (file: File, maxWidth = 1500, maxHeight = 1500, quality = 0.9): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          // Use image smoothing for better quality when downscaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Use WebP if supported for best quality/size, otherwise PNG to preserve transparency and sharpness
          try {
            const dataUrl = canvas.toDataURL("image/webp", quality);
            if (dataUrl.startsWith("data:image/webp")) {
              resolve(dataUrl);
              return;
            }
          } catch (e) {
            console.warn("WebP conversion failed, falling back to PNG");
          }
          
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
