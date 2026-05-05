# MCTJK — Tech-Luxury Hotel Platform

![MCTJK Preview](https://github.com/Al1mov77/MCTJK/raw/main/preview.png) *(Placeholder for preview image)*

**MCTJK** — это ультрасовременная платформа для бронирования отелей премиум-класса, объединяющая эстетику "Tech-Luxury" с передовыми веб-технологиями. Проект ориентирован на создание кинематографичного пользовательского опыта с использованием сложных анимаций и высокой производительности.

---

## 🚀 Основные возможности

### 💎 Премиальный UX/UI
- **Cinematic Scroll**: Использование GSAP, ScrollTrigger и Lenis для создания плавного, "весомого" скролла.
- **Canvas Rendering**: Высокопроизводительная отрисовка последовательностей изображений для достижения эффекта 60fps в анимациях.
- **Apple-inspired Design**: Минималистичная типографика, глубокие градиенты и стеклянный эффект (glassmorphism).

### 🏨 Управление отелями и бронированием
- **Динамический каталог**: Полный цикл управления отелями, номерами и ценами.
- **Система бронирования**: Интеграция процессов выбора дат, номеров и подтверждения заказа.
- **Система VIP-статусов**: Эксклюзивные привилегии для элитных пользователей, включая автоматические купоны на скидку 50%.

### 💬 Социальные функции
- **VIP Group Chat**: Групповой чат в реальном времени для членов VIP-клуба (Socket.io).
- **Global Room Comments**: Социальное взаимодействие прямо в карточках номеров.
- **Система отзывов**: Полноценная система рейтингов и отзывов для каждого отеля.

---

## 🛠 Технологический стек

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS, CSS Modules
- **Animations**: GSAP (GreenSock), Framer Motion, Lenis Smooth Scroll
- **State Management**: React Hooks, Context API
- **Interactions**: Lucide Icons, Radix UI

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.io (WebSockets)
- **Security**: JWT (Passport.js), Bcrypt
- **Documentation**: Swagger (OpenAPI)

---

## 📦 Структура проекта

```text
MCTJK/
├── frontend/          # Клиентское приложение (Next.js)
│   ├── app/           # Маршруты и страницы
│   ├── components/    # UI компоненты
│   └── lib/           # Утилиты и переводы
├── backend/           # API Сервер (NestJS)
│   ├── src/           # Исходный код сервера
│   ├── prisma/        # Схема БД и миграции
│   └── test/          # E2E тесты
└── README.md          # Данная документация
```

---

## 🛠 Установка и запуск

### Предварительные требования
- Node.js (v18+)
- PostgreSQL (запущенный локально или в облаке)

### 1. Настройка Backend
```bash
cd backend
npm install
# Настройте .env файл (DATABASE_URL, JWT_SECRET)
npx prisma migrate dev
npm run start:dev
```
*API будет доступно по адресу: `http://localhost:4000`*
*Swagger документация: `http://localhost:4000/api`*

### 2. Настройка Frontend
```bash
cd frontend
npm install
npm run dev
```
*Приложение будет доступно по адресу: `http://localhost:3000`*

---

## 🌟 Философия проекта
MCTJK — это не просто сайт для бронирования. Это цифровой портал в мир роскоши. Каждый пиксель и каждая анимация настроены так, чтобы пользователь чувствовал эксклюзивность сервиса с первого клика.

---
*Разработано с использованием передовых практик Advanced Agentic Coding.*
