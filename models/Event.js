import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    organizer: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Advanced: Додати індекси в БД для прискорення сортування та пошуку
eventSchema.index({ date: 1 });
eventSchema.index({ title: 1 });
// Індекс для курсорної пагінації по ID працює автоматично, оскільки _id завжди індексується в MongoDB

export const Event = mongoose.model('Event', eventSchema);
