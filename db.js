import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practical_work';
        await mongoose.connect(uri);
        console.log(`Підключено до MongoDB (${uri})`);
    } catch (err) {
        console.error('Помилка підключення до MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;
