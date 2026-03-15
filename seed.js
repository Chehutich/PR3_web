import mongoose from 'mongoose';
import connectDB from './db.js';
import { Event } from './models/Event.js';
import { Participant } from './models/Participant.js';

async function seed() {
    try {
        await connectDB();

        console.log('Очищення колекцій...');
        await Event.deleteMany({});
        await Participant.deleteMany({});

        console.log('Наповнення колекції events...');
        const eventsData = [
            { title: 'Tech Conference', description: 'Annual tech conf', date: new Date('2026-06-15T10:00:00'), organizer: 'Tech Corp' },
            { title: 'Art Exhibition', description: 'Modern art gallery', date: new Date('2026-07-20T14:00:00'), organizer: 'Art Museum' },
            { title: 'Music Festival', description: 'Outdoor music festival', date: new Date('2026-08-05T18:00:00'), organizer: 'Rock Events' },
            { title: 'Web Dev Meetup', description: 'Discussion about Vue', date: new Date('2026-05-10T19:00:00'), organizer: 'Dev Community' },
            { title: 'AI Workshop', description: 'Hands-on AI training', date: new Date('2026-09-12T09:00:00'), organizer: 'AI Labs' },
            { title: 'Yoga Retreat', description: 'Weekend of relaxation', date: new Date('2026-04-20T08:00:00'), organizer: 'Wellness Center' },
            { title: 'Startup Pitch', description: 'Pitch your business', date: new Date('2026-10-05T15:00:00'), organizer: 'Incubator' },
            { title: 'Gaming Expo', description: 'Latest video games', date: new Date('2026-11-15T11:00:00'), organizer: 'Gamers Unite' },
            { title: 'Food Tasting', description: 'Local food festival', date: new Date('2026-05-25T12:00:00'), organizer: 'Foodies' },
            { title: 'Marathon', description: 'City 10k run', date: new Date('2026-04-30T07:00:00'), organizer: 'City Sports' },
            { title: 'Photo Walk', description: 'Urban photography', date: new Date('2026-06-05T16:00:00'), organizer: 'Photo Club' },
            { title: 'Design Sprint', description: 'UX UI design workshop', date: new Date('2026-08-15T10:00:00'), organizer: 'Design Masters' },
            { title: 'Crypto Summit', description: 'Blockchain discussions', date: new Date('2026-09-25T09:00:00'), organizer: 'Crypto Net' },
            { title: 'Book Reading', description: 'Author meet and greet', date: new Date('2026-07-10T18:00:00'), organizer: 'City Library' },
            { title: 'Charity Gala', description: 'Fundraising event', date: new Date('2026-12-01T19:00:00'), organizer: 'Charity Org' }
        ];

        const insertedEvents = await Event.insertMany(eventsData);

        console.log('Наповнення колекції participants...');
        const firstEventId = insertedEvents[0]._id;
        const secondEventId = insertedEvents[1]._id;

        const participantsData = [
            { name: 'Alice Smith', email: 'alice@example.com', eventId: firstEventId },
            { name: 'Bob Jones', email: 'bob@example.com', eventId: firstEventId },
            { name: 'Charlie Brown', email: 'charlie@example.com', eventId: secondEventId },
            { name: 'Diana Prince', email: 'diana@example.com', eventId: secondEventId }
        ];

        await Participant.insertMany(participantsData);

        console.log('БД успішно наповнена!');
        process.exit(0);
    } catch (error) {
        console.error('Помилка при виконанні seed-скрипту:', error);
        process.exit(1);
    }
}

seed();
