import { injectable } from "inversify";
import {
  GenerateUploadUrlInput,
  IS3Service,
  preSignedUploadResult,
} from "../interfaces/IS3Service";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

@injectable()
export class S3Service implements IS3Service {
  private readonly s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({ region: this.region });
  }
  private get region(): string {
    const region = process.env.AWS_REGION;
    if (!region)
      throw new CustomError(RESPONSE_MESSAGES.S3_BUCKET.ERROR.MISSING_REGION);
    return region;
  }
  private get bucket(): string {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket)
      throw new CustomError(RESPONSE_MESSAGES.S3_BUCKET.ERROR.MISSING_BUCKET);
    return bucket;
  }
  async generateUploadURL(
    input: GenerateUploadUrlInput,
  ): Promise<preSignedUploadResult> {
    const ext = ALLOWED_MIME_TYPES[input.fileType];
    if (!ext)
      throw new CustomError(
        RESPONSE_MESSAGES.S3_BUCKET.ERROR.UNSUPPORTED_IMAGE_TYPE,
      );
    const folder = input.folder ?? "avatars";
    const key = `${folder}/${input.userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: input.fileType,
    });
    const uploadURL = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });
    const fileURL = this.buildFileUrl(key);
    return { uploadURL, fileURL, key };
  }

  async deleteObject(keyOrUrl: string): Promise<void> {
    const key = this.extractKey(keyOrUrl);
    if (!key) return;
    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
  private buildFileUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private extractKey(keyOrUrl: string): string {
    if (!keyOrUrl.startsWith("http")) {
      return keyOrUrl.replace(/^\/+/, "");
    }
    try {
      const parsed = new URL(keyOrUrl);
      return parsed.pathname.replace(/^\/+/, "");
    } catch (error) {
      return "";
    }
  }
}
