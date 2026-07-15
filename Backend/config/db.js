const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("❌ Database Connection Failed");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;