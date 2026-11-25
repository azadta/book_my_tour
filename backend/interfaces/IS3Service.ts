export interface GenerateUploadUrlInput {
  userId: string;
  fileName: string;
  fileType: string;
  folder: string;
}

export interface preSignedUploadResult {
  uploadURL: string;
  fileURL: string;
  key: string;
}
export interface IS3Service {
  generateUploadURL(
    input: GenerateUploadUrlInput,
  ): Promise<preSignedUploadResult>;
  deleteObject(keyOrUrl: string): Promise<void>;
}
