import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    const connection = mongoose.connection;

    connection.on("collection", () => {
      console.log(`Connected to MongoDB successfully`);
    });

    connection.on("error", () => {
      console.error(`MongoDB connection error`);
      process.exit(1);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
