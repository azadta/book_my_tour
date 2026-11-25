import { FEEDBACK_MESSAGES } from "@/constants/feedbackMessages";
import axios from "axios";

type PresignResponse = {
  result: {
    uploadUrl: string;
    fileUrl: string;
  };
};

export const uploadImagesToS3 = async (
  files: File[],
  folder:
    | "avatars"
    | "packages"
    | "destinations"
    | "images"
    | "chats"
    | "reviews" = "images",
): Promise<string[]> => {
  const urls: string[] = [];
  try {
    for (const file of files) {
      const { data } = await axios.post<PresignResponse>(
        "http://localhost:4000/api/upload/presign",
        {
          fileName: file.name,
          fileType: file.type,
          folder,
        },
        { withCredentials: true },
      );
      const uploadUrl = data.result.uploadUrl;
      const fileUrl = data.result.fileUrl;
      if (!uploadUrl || !fileUrl) {
        throw new Error(FEEDBACK_MESSAGES.UPLOAD.ERROR.MISSING_PRESIGNED_URL);
      }
      await axios.put(uploadUrl, file, {
        headers: { ContentType: file.type },
      });
      urls.push(fileUrl);
    }
    return urls;
  } catch (error) {
    throw error;
  }
};
