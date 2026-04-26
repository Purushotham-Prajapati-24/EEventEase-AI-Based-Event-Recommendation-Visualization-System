import api from "./api";


const IMAGEKIT_PUBLIC_KEY = "public_PAxx6+obQLdTPblXLxJPCuMY1Lo=";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // 1. Get authentication parameters from backend
    const authParams = await api.get("/imagekit/auth");

    // 2. Prepare form data for ImageKit
    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);
    formData.append("signature", authParams.signature);
    formData.append("expire", authParams.expire);
    formData.append("token", authParams.token);
    formData.append("fileName", file.name);
    formData.append("useUniqueFileName", "true");

    // 3. Upload to ImageKit
    const response = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};
