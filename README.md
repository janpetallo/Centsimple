# Centsimple

<p align="center">
<img src="https://raw.githubusercontent.com/janpetallo/finance-tracker-app/main/assets/favicon.svg" alt="Centsimple Logo" width="120">
</p>

<h3 align="center">A full-stack personal finance management application designed to provide a comprehensive and intuitive platform to track income and expenses.</h3>

## About The Project

Centsimple is a complete full-stack application built from the ground up, inspired by the curriculum of The Odin Project. It serves as a comprehensive portfolio piece demonstrating a wide range of modern web development skills, from a secure backend API to a polished, responsive React frontend.

The application is designed with a "simple, but not bland" philosophy, taking inspiration from the Material 3 design system to create a user experience that is clean, intuitive, and trustworthy, while also being delightful to use.

## Key Features

- **Secure User Authentication:** Full registration and login flow with JWTs stored in secure, httpOnly cookies. Passwords are fully hashed using bcryptjs.
- **Email Verification:** A complete, professional email verification system to ensure user authenticity, including a "resend verification" feature.
- **Full CRUD Functionality:** Users can Create, Read, Update, and Delete both their financial transactions and their personalized spending categories.
- **Dynamic Dashboard:** A central hub that displays the user's overall balance, a paginated list of recent transactions, and management tools.
- **Advanced Filtering & Search:** The transaction list can be filtered by date range and category, and includes a debounced text search for a fast and responsive user experience.
- **Personalized Category Pinning:** Users can "pin" their most-used categories (both default and custom) to sort them to the top of lists for quick access.
- **Data-Driven Insights:** A dedicated "Insights" page with interactive charts (Bar and Pie) that provide a visual summary of the user's financial habits over various time periods.
- **Professional UI/UX:**
  - Built with a mobile-first, fully responsive design.
  - A cohesive design system for color, typography, and shape inspired by Google's Material 3.
  - Custom, reusable UI components like modals, dialogs, and segmented controls for a polished, app-like feel.
  - Robust loading, error, and empty states to ensure a clear and intuitive user journey.

## Tech Stack

### Frontend

- **Framework:** React (with Vite)
- **Styling:** Tailwind CSS (v4, CSS-first approach)
- **Routing:** React Router
- **State Management:** React Context & Custom Hooks
- **Data Visualization:** Chart.js

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** Passport.js (Local and JWT strategies)
- **Database ORM:** Prisma
- **Email Service:** Nodemailer (with Ethereal for development)

### Database

- PostgreSQL

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm
- A PostgreSQL database instance

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/janpetallo/finance-tracker-app.git
   cd finance-tracker-app
   ```
2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```
3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```
4. **Set Up Environment Variables**

   - In the `backend` folder, create a `.env` file. You can use the `.env.example` file as a template.
   - **Generate Ethereal Credentials:** To get your development email credentials, temporarily uncomment the `createTestAccount()` function call in `backend/src/services/email.service.js`. Run the script with `node src/services/email.service.js`, copy the new credentials into your `.env` file, and then re-comment the function call.
   - In the `frontend` folder, create a `.env.local` file. Use the `.env.local.example` file as a template.

5. **Run Database Migrations**
   From the `backend` folder, run:
   ```bash
   npm run migrate
   npm run seed
   ```
6. **Run the Application**
   - Start the backend server from the `backend` folder:
     ```bash
     npm run dev
     ```
   - Start the frontend server from the `frontend` folder:
     ```bash
     npm run dev
     ```

## Future Enhancements

This project is a solid MVP with a clear roadmap for future features, including:

- Savings Goals: A dedicated feature to create and track progress towards financial goals.
- AI Integration: Exploring opportunities to integrate AI for smarter financial insights and automation.
- Subscription Saver: A tool to manage and track recurring bills and subscriptions.
- Dark Mode: A complete, professionally designed dark theme.
- Custom Form Components: Replacing all native browser controls (like dropdowns and date pickers) with fully-styled, custom components.
