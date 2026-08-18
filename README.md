# Pepacks Indie Games Platform

A modern indie game discovery platform built with React, PHP, and SQLite.

## Features

- Browse indie games with search and filtering
- Game detail pages with screenshots, tags, and ratings
- User authentication (login/register)
- Admin panel for managing games
- Cookie consent banner (GDPR compliant)
- Responsive dark-mode design

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** PHP REST API
- **Database:** SQLite

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pepacks-web-clean.git
cd pepacks-web-clean
```

2. Install Node dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
php scripts/init.php
```

## Development

### Start Frontend (Vite Dev Server)
```bash
npm run dev
# or
./node_modules/.bin/vite --port 8080
```

### Start Backend (PHP Server)
```bash
php -S localhost:8090 api/index.php
```

## Production Build

```bash
npm run build
```

Then serve with PHP:
```bash
php -S localhost:8080 router.php
```

## Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/games | List games |
| GET | /api/games/:id | Get single game |
| POST | /api/games | Create game (auth required) |
| PUT | /api/games/:id | Update game (auth required) |
| DELETE | /api/games/:id | Delete game (auth required) |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |

## License

MIT
