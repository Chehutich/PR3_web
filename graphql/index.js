import { Event } from '../models/Event.js';
import { Participant } from '../models/Participant.js';
import { User } from '../models/User.js';

export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    role: String!
  }

  type Participant {
    id: ID!
    eventId: ID!
    name: String!
    email: String!
  }

  type Event {
    id: ID!
    title: String!
    description: String
    date: String!
    organizer: String!
    creator: User
    createdAt: String!
    
    # Advanced: Nested Fields
    participants: [Participant]
  }

  input EventInput {
    title: String!
    description: String
    date: String!
    organizer: String!
  }

  type Query {
    # Middle: getEvents з пагінацією та фільтрацією
    getEvents(limit: Int, skip: Int, title: String): [Event]
  }

  type Mutation {
    # Middle: addEvent
    addEvent(input: EventInput!): Event
  }
`;

// Валідація email
const isValidEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

export const resolvers = {
    Query: {
        getEvents: async (_, { limit = 10, skip = 0, title }) => {
            let query = {};
            if (title) {
                query.title = { $regex: title, $options: 'i' }; // Фільтрація по підрядку
            }
            return await Event.find(query).skip(skip).limit(limit).exec();
        }
    },
    
    Mutation: {
        addEvent: async (_, { input }, context) => {
            // Advanced: Security (Перевірка сесії)
            if (!context.user) {
                throw new Error('Unauthorized: Потрібно увійти в систему');
            }

            // Advanced: Data Validation (Валідація формату email для поля organizer)
            if (!isValidEmail(input.organizer)) {
                throw new Error('Валідація не пройдена: organizer має бути валідним email');
            }

            const newEvent = new Event({
                ...input,
                creator: context.user.id
            });
            return await newEvent.save();
        }
    },
    
    Event: {
        // Advanced: Nested Fields (позбавлення N+1 - для повного Production треба DataLoader, але тут базово)
        participants: async (parent) => {
            return await Participant.find({ eventId: parent.id });
        },
        creator: async (parent) => {
            if (!parent.creator) return null;
            return await User.findById(parent.creator);
        }
    }
};
