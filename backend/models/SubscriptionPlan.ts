import { Document, model, Schema } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  price: number;
  packageLimit: number;
  durationDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    packageLimit: { type: Number, required: true },
    durationDays: { type: Number, required: true },
  },
  { timestamps: true },
);

export const SubscriptionPlan = model<ISubscriptionPlan>(
  "SubscriptionPlan",
  subscriptionPlanSchema,
);
