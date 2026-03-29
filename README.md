# Практична робота №3: Основи Node.js та HTTP
Базовий HTTP сервер на Node.js.

**Особливості:**
- **Base**: Видача JSON-списку подій (`/api/events`).
- **Middle**: Логування запитів, конфігурація у `config.js`.
- **Advanced**: Автоперезапуск з `nodemon`, обробка помилок (404, 500).

**Запуск:**
1. `npm install` (залежності)
2. `npm run dev` (режим розробки)


# Лабораторна робота №4 (Частина 1): Основи Express.js
Сервер переписано з використанням фреймворку Express.js.

**Особливості:**
- **Base**: Маршрут `GET /events` (повертає JSON список подій).
- **Middle**: Middleware для логування часу запиту. Пагінація (`?page=1&limit=10`).
- **Advanced**: Сортування (`?sort=title&order=desc`). Валідація параметрів (`page >= 1`).


# Лабораторна робота №4 (Частина 2): Підключення бази даних
Сервер підключено до безкоштовного кластера **MongoDB Atlas**. Дані беруться безпосередньо з бази даних.

**Особливості:**
- Побудовано за допомогою `mongoose` та MongoDB Atlas. Створено `seed.js` для наповнення БД.
- Реалізовано сторінкову пагінацію (`page` і `limit`), сортування (`sort` та `order`), а також **cursor-based** пагінацію для нескінченного скролу в Advanced рівні.


# Лабораторна робота №5: Безпека, сесії та авторизація
Реалізація механізму входу в систему для організаторів подій та захист приватних маршрутів.

**Особливості:**
- **Base**: Створено модель `User`. Реалізовано `POST /auth/register` (хешування через `bcrypt`) та `POST /auth/login` (вхід через `express-session`).
- **Middle**: Додано middleware `checkAuth`. Маршрут `GET /participants/:eventId` (перегляд учасників події) захищено – доступний лише для авторизованих користувачів. Без сесії повертається 401 Unauthorized.
- **Advanced**: Реалізовано middleware `checkRole` для перевірки ролей ('User', 'Organizer', 'Admin'). Створено тестовий захищений маршрут `DELETE /events/:eventId` (доступний лише для Admin).


# Практична робота №4: Проектування гібридних API: REST vs GraphQL
Реалізовано дві паралельні архітектури API для існуючої бази даних.

**Особливості:**
- **Base (REST)**: Додано поле `creator` до `Event`. Розширено REST контролери повним набором CRUD: `POST /events`, `PUT /events/:id`, `DELETE /events/:id` з перевіркою ролей/власника. Додано `POST /participants`.
- **Middle (GraphQL)**: Інтегровано `@apollo/server`. Написано `schema.graphql` (типи User, Event, Participant). Створено Query `getEvents` з підтримкою пагінації та фільтрації, і Mutation `addEvent`.
- **Advanced (GraphQL)**: Реалізовано *Nested Fields* (отримання списку учасників всередині події без N+1). Додано доступ до сесії Express (auth context) всередині GraphQL резолверів. Реалізовано Data Validation (email-формат для поля organizer під час створення події).

**Точки входу:**
- REST API: `http://localhost:3000/` (`/events`, `/auth`, `/participants`)
- GraphQL Sandbox: `http://localhost:3000/graphql`
