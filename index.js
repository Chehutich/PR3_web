import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { PORT, HOST } from './config.js';
import connectDB from './db.js';

// Імпорт маршрутів
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import participantRoutes from './routes/participants.js';

// Імпорт GraphQL конфігурації
import { typeDefs, resolvers } from './graphql/index.js';

const app = express();

// Створюємо HTTP сервер на базі Express додатку
const httpServer = createServer(app);

// Налаштовуємо Socket.IO з підтримкою CORS для майбутнього React фронтенду
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173', // Для продакшену варто змінити на реальний URL
        methods: ['GET', 'POST'],
        credentials: true
    }
});

(async function startServer() {
    // Підключення до БД при старті сервера
    await connectDB();

    // CORS Middleware для Express
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
    }));
    
    app.use(express.json());

    // Налаштування сесій
    app.use(session({
        secret: 'my_super_secret_key_123',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // В продакшені (HTTPS) має бути true
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
    });

    await apolloServer.start();

    app.use('/graphql', expressMiddleware(apolloServer, {
        context: async ({ req }) => {
            return { user: req.session?.user };
        }
    }));

    // =====================
    // WEB SOCKETS (Advanced)
    // =====================
    io.on('connection', (socket) => {
        console.log(`Клієнт підключився до чату підтримки (ID: ${socket.id})`);

        // Отримання повідомлення від клієнта
        socket.on('support_message', (data) => {
            console.log('Нове повідомлення в чаті:', data);
            
            // Відправляємо повідомлення всім підключеним клієнтам (Broadcasting)
            io.emit('support_message', data);
        });

        socket.on('disconnect', () => {
            console.log(`Клієнт відключився (ID: ${socket.id})`);
        });
    });

    // Обробка неіснуючих маршрутів
    app.use((req, res) => {
        res.status(404).json({ error: "Маршрут не знайдено." });
    });

    // Зверніть увагу: ми запускаємо httpServer (з Socket.IO), а не app (Express)
    httpServer.listen(PORT, HOST, () => {
        console.log(`\n🚀 Фінальний Сервер (Express + GraphQL + WebSockets) успішно запущено!`);
        console.log(`🌐 Адреса сервера: http://${HOST}:${PORT}`);
        console.log(`💬 WebSockets (Socket.IO) готові до прийому з'єднань`);
    });
})();
