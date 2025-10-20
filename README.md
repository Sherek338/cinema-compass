// ...existing code...

# 🚀 Node.js проект

Краткое руководство по разворачиванию проекта, работе с ветками и использованию основных скриптов.

---

## 🔧 Установка окружения

Перед началом убедитесь, что у вас установлены:

- Node.js (рекомендуется последняя LTS): https://nodejs.org
- Git: https://git-scm.com/downloads

Клонирование и установка зависимостей:

```bash
git clone <ссылка-на-репозиторий>
cd <название-папки>
npm install
```

---

## 🌿 Работа с ветками

Просмотреть все ветки (локальные и удалённые):

```bash
git branch -a
```

Переключиться на существующую ветку:

```bash
git checkout <имя-ветки>
```

Создать новую ветку разработки на основе ветки `client`:

```bash
git checkout -b feature/<название-фичи> client
```

⚠️ Важно: не вносите изменения напрямую в ветку `main`. Все разработки ведутся в ветке `client` или в ветках, созданных от неё (например, `feature/...`).

---

## ⚙️ Скрипты npm

В файле `package.json` доступны скрипты:

```json
"scripts": {
  "server": "nodemon server/index.js",
  "client": "vite",
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

Описание:

- npm run server — запускает серверную часть (nodemon).
- npm run client — запускает фронтенд через сборщик Vite.
- npm run dev — запускает одновременно сервер и клиент (concurrently).
- npm run build — сборка фронтенда для продакшена.
- npm run preview — предпросмотр собранного фронтенда.
- npm run lint — проверка кода через ESLint.
- npm run format — форматирование кода через Prettier.

---

## 💾 Работа с Git (основные команды)

Добавить изменения в staging:

```bash
git add .
```

Сделать коммит:

```bash
git commit -m "Короткое описание изменений"
```

Отправить изменения на удалённый репозиторий:

```bash
git push origin <имя-ветки>
```

Пример:

```bash
git push origin feature/login
```

Перед началом работы обновите `client`:

```bash
git checkout client
git pull origin client
```

---

## 💡 Рекомендации

Перед коммитом запускайте:

```bash
npm run lint && npm run format
```

Для локальной разработки удобно использовать:

```bash
npm run dev
```
