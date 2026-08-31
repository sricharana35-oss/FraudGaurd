# Multi-Account Abuse Detection & Fraudulent Signup Prevention System

A web-based fraud detection system that identifies suspicious signup attempts using behavioral and contextual signals such as IP addresses and device IDs.

## Features

- User signup system
- MongoDB database
- IP address detection
- Device ID detection
- Fraud risk scoring
- LOW / MEDIUM / HIGH risk classification
- ALLOW / REVIEW / LIMIT actions
- Linked account detection
- Admin dashboard
- Signup history
- Risk statistics

## Technology Stack

### Frontend
- Svelte
- Vite

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB Atlas

## Fraud Detection Logic

| Signal | Score |
|---|---:|
| Matching IP address | +30 |
| Matching device ID | +50 |

Risk levels:

- 0–29 → LOW → ALLOW
- 30–59 → MEDIUM → REVIEW
- 60–100 → HIGH → LIMIT

## Running the Project

### Backend

```bash
cd backend
npm install
node server.js