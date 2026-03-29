import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    organizer: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

eventSchema.index({ date: 1 });
eventSchema.index({ title: 1 });

export const Event = mongoose.model('Event', eventSchema);
