import { HydratedDocument } from "mongoose";
import { IAdmin } from "./IAdmin";
import { IBaseRepository } from "./IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<HydratedDocument<IAdmin> | null>;

  updateProfieImage(
    id: string,
    image: string,
  ): Promise<HydratedDocument<IAdmin> | null>;
  save(admin: IAdmin): Promise<IAdmin>;
}
