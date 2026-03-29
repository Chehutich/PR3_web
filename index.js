import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5'; // Змінено на express5
import { PORT, HOST } from './config.js';
import connectDB from './db.js';

// Імпорт маршрутів
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import participantRoutes from './routes/participants.js';

// Імпорт GraphQL конфігурації
import { typeDefs, resolvers } from './graphql/index.js';

const app = express();

(async function startServer() {
    // Підключення до БД при старті сервера
    await connectDB();

    app.use(cors()); // Додано для Apollo Client / Sandbox
    app.use(express.json());

    // Налаштування сесій
    app.use(session({
        secret: 'my_super_secret_key_123',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, 
            maxAge: 1000 * 60 * 60 * 24 // 1 день
        }
    }));

    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} запит на ${req.url}`);
        next();
    });

    // =====================
    // REST API МАРШРУТИ
    // =====================
    app.use('/auth', authRoutes);
    app.use('/events', eventRoutes);
    app.use('/participants', participantRoutes);

    // =====================
    // GRAPHQL API (Middle & Advanced)
    // =====================
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (formattedError, error) => {
            // Можна додати кастомне форматування помилок
            return formattedError;
        }
    });

    await apolloServer.start();

    // Підключення GraphQL (з наданням доступу до сесії у context)
    app.use('/graphql', expressMiddleware(apolloServer, {
        context: async ({ req }) => {
            // Advanced: Передача сесії в context GraphQL
            return { user: req.session?.user };
        }
    }));

    // Обробка неіснуючих маршрутів
    app.use((req, res) => {
        res.status(404).json({ error: "Маршрут не знайдено." });
    });

    app.listen(PORT, HOST, () => {
        console.log(`Сервер Express успішно запущено: http://${HOST}:${PORT}`);
        console.log(`Доступні REST маршрути:  http://${HOST}:${PORT}/events`);
        console.log(`Доступний GraphQL API:   http://${HOST}:${PORT}/graphql`);
    });
})();
