# MCTJK Backend (NestJS)

Ядро платформы MCTJK, обеспечивающее работу API, авторизацию и взаимодействие в реальном времени.

## 🚀 Стек технологий
- **NestJS**: Прогрессивный Node.js фреймворк.
- **Prisma**: Современный ORM для TypeScript.
- **PostgreSQL**: Реляционная база данных.
- **Passport.js & JWT**: Безопасная аутентификация.
- **Socket.io**: Двустороннее взаимодействие для чатов.
- **Class-validator**: Валидация входящих данных.

## 🛠 Установка

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Настройте переменные окружения в `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mctjk"
   JWT_SECRET="your_secret_key"
   PORT=4000
   ```

3. Запустите миграции базы данных:
   ```bash
   npx prisma migrate dev
   ```

4. Заполните базу начальными данными (Seed):
   ```bash
   npm run seed
   ```

## 🏃 Запуск
```bash
# Режим разработки
npm run start:dev

# Production режим
npm run build
npm run start:prod
```

## 📖 API Документация
После запуска сервера документация Swagger доступна по адресу: `http://localhost:4000/api`
