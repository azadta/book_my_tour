import {
  IAdminUpdateOperatorinput,
  IAdminUpdateOperatorRequestDTO,
  IBlockOperatorRequestDTO,
  IVerifyOperatorRequestDTO,
  LoginAdminBody,
  LoginAdminRequestDTO,
  ResetAdminPasswordAuthenticatedBody,
  ResetAdminPasswordAuthenticatedRequestDTO,
  UpdateAdminBody,
  UpdateAdminProfileImageBody,
  UpdateAdminProfileImageRequestDTO,
  UpdateAdminRequestDTO,
} from "../../dto/admin/adminRequestDTO";
import { OperatorRequestMapper } from "../operator/OperatorRequestMapper";

export class AdminRequestMapper {
  static toLoginRequestDTO(body: LoginAdminBody): LoginAdminRequestDTO {
    return {
      email: (body.email || "").trim().toLowerCase(),
      password: body.password || "",
    };
  }

  static toUpdateAdminRequestDTO(body: UpdateAdminBody): UpdateAdminRequestDTO {
    const address = body.address;
    return {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.mobile !== undefined && { mobile: body.mobile.trim() }),
      ...(address !== undefined && {
        address: {
          ...(address.houseNo !== undefined && {
            houseNo: address.houseNo.trim(),
          }),
          ...(address.landmark !== undefined && {
            landmark: address.landmark.trim(),
          }),
          ...(address.city !== undefined && { city: address.city.trim() }),
          ...(address.state !== undefined && { state: address.state.trim() }),
          ...(address.country !== undefined && {
            country: address.country.trim(),
          }),
          ...(address.postalCode !== undefined && {
            postalCode: address.postalCode.trim(),
          }),
        },
      }),
    };
  }

  static toUpdateProfileImageRequestDTO(
    body: UpdateAdminProfileImageBody,
  ): UpdateAdminProfileImageRequestDTO {
    return {
      image: (body.image || "").trim(),
    };
  }

  static toResetPasswordAuthenticatedRequestDTO(
    body: ResetAdminPasswordAuthenticatedBody,
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
  static toBlockOperatorPayload(data:{
    isBlocked: boolean;
  }):IBlockOperatorRequestDTO {
    return {
      isBlocked: Boolean(data.isBlocked),
    };
  }

  static toAdminUpdateOperatorRequestDTO(
    data: IAdminUpdateOperatorinput,
  ): IAdminUpdateOperatorRequestDTO {
    return {
      name: data?.name,
      isPremium: data.isPremium === true || data.isPremium === "true",
      isVerified: data.isVerified === true || data.isVerified === "true",
      isEmailVerified:
        data.isEmailVerified === true || data.isEmailVerified === "true",
      mobile: Number(data?.mobile),
      ...(data?.verificationDetails && {
        verificationDetails:
          OperatorRequestMapper.verificationDetailsRequestMapper(
            data.verificationDetails,
          ),
      }),
    };
  }
}
