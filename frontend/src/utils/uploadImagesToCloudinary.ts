import axios from "axios";

 export  const uploadImagesToCloudinary = async (files: File[]) => {
    const urls: string[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          formData,
        );
        urls.push(res.data.secure_url);
      }
      return urls;
    } catch (error: any) {
      console.error(error);
    }
  };