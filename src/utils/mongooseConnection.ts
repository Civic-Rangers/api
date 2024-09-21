import mongoose from "mongoose";
import "dotenv/config";

export const mongoConnector = async () => {
  try {
    const dbConnection = await mongoose.connect(`${process.env.MONGO_URI}`);

    console.log(`Connected to MongoDB: ${dbConnection.connection.host}`);

    return dbConnection;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err} on environment`);

    throw err;
  }
};
