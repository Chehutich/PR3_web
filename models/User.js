import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Organizer', 'Admin'], default: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
