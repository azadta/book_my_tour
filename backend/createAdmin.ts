import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin";
import { RESPONSE_MESSAGES } from "./constants/messages";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO!);

    const existingAdmin = await Admin.findOne({ email: "admin@abc.com" });
    if (existingAdmin) {
      console.log(RESPONSE_MESSAGES.AUTH.ERROR.EMAIL_EXISTS);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("100101", 10);
    const admin = await Admin.create({
      name: "MainAdmin",
      email: "admin@abc.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin created", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin", error);
    process.exit(1);
  }
};

createAdmin();
