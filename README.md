# HereNow API

Backend for the **HereNow** geo-locked attendance app. Built with **Express.js** and **TypeScript** to provide secure clock-in endpoints, location verification, and attendance record management.

## Features

- 🌍 Geo-lock enforcement via coordinates
- 🔐 Secure clock-in with validation
- 📦 RESTful API for attendance data
- 🗃️ MongoDB/PostgreSQL ready (optional)
- 🚀 Easy deployment on any Node environment

## Tech Stack

- Node.js + Express
- TypeScript
- CORS, Helmet, Dotenv
- (Optional) MongoDB / PostgreSQL for persistence

## Getting Started

```bash
git clone https://github.com/your-username/herenow-api.git
cd herenow-api
npm install
npm run dev
```

## Project Structure
```bash
src/
├── index.ts          # Entry point
├── routes/           # API routes
├── controllers/      # Logic handlers
├── utils/            # Geolocation & validation
```

## Requirements
- Node.js ≥ 18
- Geolocation input from frontend

- Environment variables:
-- `PORT`
-- `OFFICE_LAT`
-- `OFFICE_LNG`
-- `GEOFENCE_RADIUS_METERS`

## API Example
```http
POST /clock-in
Content-Type: application/json

{
  "userId": "123",
  "latitude": -6.2,
  "longitude": 106.8,
  "createdAt": "2025-05-29T08:30:00Z"
}
```

## License
MIT
