import {
  IAdminUpdateOperatorRequestDTO,
  IBlockOperatorRequestDTO,
  IVerifyOperatorRequestDTO,
  LoginAdminRequestDTO,
  ResetAdminPasswordAuthenticatedRequestDTO,
  UpdateAdminProfileImageRequestDTO,
  UpdateAdminRequestDTO,
} from "../../dto/admin/adminRequestDTO";
import { OperatorRequestMapper } from "../operator/OperatorRequestMapper";

export class AdminRequestMapper {
  static toLoginRequestDTO(body: any): LoginAdminRequestDTO {
    return {
      email: (body.email || "").trim().toLowerCase(),
      password: body.password || "",
    };
  }

  static toUpdateAdminRequestDTO(body: any): UpdateAdminRequestDTO {
    return {
      name: body?.name?.trim(),
      mobile: body?.mobile,
      address: {
        houseNo: body?.address?.houseNo?.trim(),
        landMark: body?.address?.landmark?.trim(),
        city: body?.address?.city?.trim(),
        state: body?.address?.state?.trim(),
        country: body?.address?.country?.trim(),
        postalCode: body?.address?.postalCode?.trim(),
      },
    };
  }

  static toUpdateProfileImageRequestDTO(
    body: any,
  ): UpdateAdminProfileImageRequestDTO {
    return {
      image: (body.image || "").trim(),
    };
  }

  static toResetPasswordAuthenticatedRequestDTO(
    body: any,
  ): ResetAdminPasswordAuthenticatedRequestDTO {
    return {
      oldPassword: body.oldPassword || "",
      newPassword: body.newPassword || "",
      confirmPassword: body.confirmPassword || "",
    };
  }

  static toVerifyOperatorPayload(dto: IVerifyOperatorRequestDTO): {
    isVerified: boolean;
  } {
    return {
      isVerified: Boolean(dto.isVerified),
    };
  }
  static toBlockOperatorPayload(dto: IBlockOperatorRequestDTO): {
    isBlocked: boolean;
  } {
    return {
      isBlocked: Boolean(dto.isBlocked),
    };
  }

  static toAdminUpdateOperatorRequestDTO(data: any): IAdminUpdateOperatorRequestDTO {
    return {
      name: data?.name,
      isPremium: data?.isPremium,
      isVerified: data?.isVerified,
      isEmailVerified:data?.isEmailVerified,
      mobile: data?.mobile,
      ...(data?.verificationDetails && {
        verificationDetails:
          OperatorRequestMapper.verificationDetailsRequestMapper(
            data.verificationDetails,
          ),
      }),
    };
  }
}
