import { IAdmin } from "../../../interfaces/IAdmin";
import { IOperator } from "../../../interfaces/IOperator";
import { AdminResponseDTO } from "../../dto/admin/adminResponseDTO";
import { IOperatorResponseDTO } from "../../dto/operator/operatorResponseDTO";
import { OperatorResponseMapper } from "../operator/OperatorResponseMapper";

export class AdminResponseMapper {
  static toAdminResponseDTO(admin:IAdmin): AdminResponseDTO {
    const rawAdmin = admin.toObject ? admin.toObject() : admin;
    return {
      _id: rawAdmin._id?.toString(),
      name: rawAdmin.name,
      email: rawAdmin.email,
      image: rawAdmin?.image,
      mobile: rawAdmin?.mobile,
      role: rawAdmin.role,
      ...(rawAdmin?.address !== undefined && {
        address: {
          houseNo: rawAdmin.address?.houseNo,
          landmark: rawAdmin.address?.landmark,
          city: rawAdmin.address?.city,
          state: rawAdmin.address?.state,
          country: rawAdmin.address?.country,
          postalCode: rawAdmin.address?.postalCode,
        },
      }),
      createdAt: rawAdmin.createdAt?.toISOString(),
      updatedAt: rawAdmin.updatedAt?.toISOString(),
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
