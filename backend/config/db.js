const mongoose = require('mongoose');
const connectDB = async () => {
    try {
      const dbURI = process.env.MONGOURI;
      await mongoose.connect(dbURI);
  
      console.log("DB connected successfully");
    } catch (err) {
      console.error("DB connection failed:", err);
      process.exit(1); 
    }
  };

  module.exports = connectDB;