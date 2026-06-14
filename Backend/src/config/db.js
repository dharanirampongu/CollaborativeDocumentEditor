const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    const dbUri = process.env.MONGO_URI || process.env.DB_URL;
    if (!dbUri) {
        console.error('Error: MONGO_URI or DB_URL is not defined in .env file');
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(dbUri);
        // console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
