import { IOperatorVerificationDetailsDTO } from "../operator/operatorRequestDTO";
import { IOperatorResponseDTO } from "../operator/operatorResponseDTO";
import { AddressDTO } from "./adminRequestDTO";
export interface AdminResponseDTO {
  _id: string;
  name: string;
  email: string;
  image: string;
  mobile?: number;
  role: string;
  address?: AddressDTO;
  createdAt: string;
  updatedAt: string;
}

export interface LoginAdminResponseDTO {
  accessToken: string;
  refreshToken: string;
  adminData: AdminResponseDTO;
}



export interface IBlockOperatorResponseDTO {
  message: string;
  operator: IOperatorResponseDTO;
}
