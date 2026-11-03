import { IAdmin } from "../../../interfaces/IAdmin";
import { IOperator } from "../../../interfaces/IOperator";
import { AdminResponseDTO } from "../../dto/admin/adminResponseDTO";
import { IOperatorResponseDTO } from "../../dto/operator/operatorResponseDTO";
import { OperatorResponseMapper } from "../operator/OperatorResponseMapper";

export class AdminResponseMapper {
  static toAdminResponseDTO(admin: IAdmin): AdminResponseDTO {
    return {
      _id: admin._id?.toString(),
      name: admin.name,
      email: admin.email,
      image: admin.image,
      ...(admin.mobile !== undefined && { mobile: admin.mobile }),
      role: admin.role,
      ...(admin?.address !== undefined && {
        address: {
          ...(admin.address.houseNo !== undefined && {
            houseNo: admin.address?.houseNo,
          }),
          ...(admin.address.landmark !== undefined && {
            landmark: admin.address?.landmark,
          }),
          ...(admin.address.city !== undefined && {
            city: admin.address?.city,
          }),
          ...(admin.address.state !== undefined && {
            state: admin.address?.state,
          }),
          ...(admin.address.country !== undefined && {
            country: admin.address?.country,
          }),
          ...(admin.address.postalCode !== undefined && {
            postalCode: admin.address?.postalCode,
          }),
        },
      }),
      createdAt: admin.createdAt?.toISOString(),
      updatedAt: admin.updatedAt?.toISOString(),
    };
  }

  static toAdminOperatorListResponseDTO(
    entities: IOperator[],
  ): IOperatorResponseDTO[] {
    return entities.map((entity) =>
      OperatorResponseMapper.toOperatorResponseDTO(entity),
    );
  }

  static toAdminOperatorResponseDTO(operator: IOperator): IOperatorResponseDTO {
    return OperatorResponseMapper.toOperatorResponseDTO(operator);
  }
}
