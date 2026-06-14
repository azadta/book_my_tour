import { injectable } from "inversify";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import Admin, { IAdmin } from "../models/Admin";
import { BaseRepository } from "./baseRepository";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }
  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email });
  }
  async save(admin: IAdmin): Promise<IAdmin> {
    return admin.save();
  }

  async updateProfieImage(id: string, image: string): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(id, { image }, { new: true });
  }
}
