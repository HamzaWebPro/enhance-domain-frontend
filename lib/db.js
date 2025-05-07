import mongoose from "mongoose";

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to the database");
    return;
  }

  const dbURI = "mongodb+srv://domain:domain@app.tzveal3.mongodb.net/domain_request?retryWrites=true&w=majority&appName=app"; // Get from .env file
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
};

export default connectToDatabase;