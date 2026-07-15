import mongoose from "mongoose";

export const connectDb = () => {
  mongoose
    .connect(process.env.MONGO as string)
    .then((conn) => console.log(`Mongodb connected: ${conn.connection.host}`))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
