import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // This connects to the database specified in your MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`Successfully connected to MongoDB Host: ${conn.connection.host} 👍`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;