import { IAdmin } from "../models/Admin";
import { IBaseRepository } from "./IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;

  updateProfieImage(id: string, image: string): Promise<IAdmin | null>;
  save(admin: IAdmin): Promise<IAdmin>
}
