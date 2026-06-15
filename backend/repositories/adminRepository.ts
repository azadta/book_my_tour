import { injectable } from "inversify";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import Admin from "../models/Admin";
import { BaseRepository } from "./baseRepository";
import { IAdmin } from "../interfaces/IAdmin";
import { HydratedDocument } from "mongoose";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }
  async findByEmail(email: string): Promise<HydratedDocument<IAdmin> | null> {
    return Admin.findOne({ email });
  }
  async save(admin: HydratedDocument<IAdmin>): Promise<IAdmin> {
    return admin.save();
  }

  async updateProfieImage(id: string, image: string): Promise<HydratedDocument<IAdmin> | null>  {
    return Admin.findByIdAndUpdate(id, { image }, { new: true });
  }
}
