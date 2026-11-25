import { inject, injectable } from "inversify";
import { Types } from "../types/types";
import type { IS3Service } from "../interfaces/IS3Service";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { sendSuccessResponse } from "../utils/apiResponse";
import { StatusCode } from "../constants/statusCodeConstants";

@injectable()
export class UploadController {
  constructor(@inject(Types.S3Service) private s3Service: IS3Service) {}
  createPresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const ALLOWED_FOLDERS = new Set(["avatars", "images", "packages",'destinations','chats','reviews']);
      const { fileName, fileType, folder } = req.body as {
        fileName: string;
        fileType: string;
        folder?: string;
      };
      if (!fileName || !fileType) {
        throw new CustomError(
          RESPONSE_MESSAGES.S3_BUCKET.ERROR.FILE_NAME_AND_FILE_TYPE_REQUIRED,
        );
      }
      const targetFolder =
        folder && ALLOWED_FOLDERS.has(folder) ? folder : "avatars";
      const result = await this.s3Service.generateUploadURL({
        userId: String(req.user?.id),
        fileName,
        fileType,
        folder: targetFolder,
      });

      return sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.S3_BUCKET.SUCCESS.CREATE_PRESIGNED_URL,
        { uploadUrl: result.uploadURL, fileUrl: result.fileURL },
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
