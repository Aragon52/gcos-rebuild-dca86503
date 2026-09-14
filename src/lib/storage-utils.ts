import { supabase } from "./supabase";

/**
 * Uploads a base64 string or File to Supabase Storage and returns the public URL.
 * @param path The path in storage (e.g., 'profiles/uid/avatar.jpg')
 * @param data The base64 string (with data:image/... prefix) or File object
 * @returns The download URL
 */
export async function uploadImage(path: string, data: string | File): Promise<string> {
  const bucket = "uploads"; // Default bucket name
  
  let fileBody: File | Buffer | Blob | ArrayBuffer | string = data;

  if (typeof data === 'string' && data.includes(',')) {
    // Convert base64 to Blob
    const parts = data.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    fileBody = new Blob([ab], { type: mimeString });
  }

  let { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, fileBody, {
      upsert: true
    });

  if (uploadError) {
    if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("does not exist")) {
      console.warn("Bucket not found. Attempting to create...");
      await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      const retry = await supabase.storage
        .from(bucket)
        .upload(path, fileBody, {
          upsert: true
        });
      uploadError = retry.error;
      uploadData = retry.data;
    }

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      throw uploadError;
    }
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

/**
 * Compresses an image file to a base64 string.
 * This is useful for storing images directly in Firestore to bypass Storage rules.
 * The image is resized to max 800x800 and compressed to JPEG with 0.6 quality.
 */
export async function compressImageToBase64(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.error("[IMAGE_COMPRESS] Image processing timed out");
      resolve(null);
    }, 15000);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result) {
        clearTimeout(timeout);
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressed = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressed);
        } catch (err) {
          console.error("[IMAGE_COMPRESS] Error during canvas processing:", err);
          resolve(null);
        }
      };
      img.onerror = (err) => {
        clearTimeout(timeout);
        resolve(null);
      };
      img.src = result as string;
    };
    reader.onerror = (err) => {
      clearTimeout(timeout);
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
}
