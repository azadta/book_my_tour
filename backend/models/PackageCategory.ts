import mongoose, { Document, Schema } from "mongoose";

export interface IPackageCategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
}

const packageCategorySchema = new Schema<IPackageCategory>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPackageCategory>(
  "PackageCategory",
  packageCategorySchema
);
