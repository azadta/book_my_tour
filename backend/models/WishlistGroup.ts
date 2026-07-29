import { model, Schema } from "mongoose";
import { INote, IWishlistGroup } from "../interfaces/IWishList";

const NoteSchema = new Schema<INote>({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WishlistGroupSchema = new Schema<IWishlistGroup>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    packages: [{ type: Schema.Types.ObjectId, ref: "Package" }],
    notes: [NoteSchema],
    shareToken: {
      type: String,
      sparse: true,
      unique: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default model<IWishlistGroup>('WishlistGroup',WishlistGroupSchema)
