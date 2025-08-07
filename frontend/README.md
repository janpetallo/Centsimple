# Centsimple - Personal Finance Tracker

Centsimple is a full-stack personal finance management application designed to provide users with a clean, intuitive, and comprehensive platform to track their income and expenses, categorize transactions, and gain visual insights into their financial habits. It is specifically branded and tailored for young professionals in Canada.

## Live Demo

The application is deployed on Render. You can view the live version here: [https://centsimple.onrender.com](https://centsimple.onrender.com)

## Features

### Phase 1 (MVP)

- **Authentication:** A complete user registration, email verification, and login flow using JWTs stored in secure, httpOnly cookies.
- **Dashboard:** A central hub displaying the user's overall balance and a paginated list of transactions.
- **Transaction Management:** Full CRUD (Create, Read, Update, Delete) functionality for transactions.
- **Category Management:** Full CRUD functionality for custom categories, including a dedicated management modal.
- **Category Pinning:** A personalized feature allowing users to pin their most-used categories to the top of lists for quick access.
- **Filtering & Search:** A robust, responsive system for filtering transactions by date and category, with a debounced text search for finding specific items.
- **Insights Page:** A dedicated analytics page with interactive bar and pie charts that provide a visual summary of the user's financial habits over a selected period.

### Phase 2 (Smart Advisor)

- **Key Insights:** An AI-generated natural-language summary of a user's financial performance on the Insights page, providing a quick overview of their financial health.
- **AI-Powered Tax Tip Finder:** An intelligent feature that asynchronously checks new expense transactions and alerts the user with a dismissible card if the expense is a potential Canadian tax deduction.

## Tech Stack

| Category       | Technology / Tool                         |
| :------------- | :---------------------------------------- |
| **Frontend**   | React (with Vite), React Router, Chart.js |
| **Styling**    | Tailwind CSS v4                           |
| **Backend**    | Node.js, Express.js, Passport.js          |
| **AI**         | Google Gemini (`@google/genai`)           |
| **ORM**        | Prisma                                    |
| **Database**   | PostgreSQL (hosted on Aiven)              |
| **Deployment** | Render (Frontend & Backend)               |

## Local Development Setup

To run this project locally, you will need to set up both the backend and frontend services.

### Prerequisites

- Node.js (v18 or later)
- npm
- A PostgreSQL database instance

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    - Create a `.env` file by copying the example: `cp .env.example .env`
    - Fill in the required variables, especially `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY`.
4.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```
5.  **(Optional) Seed the database with default categories:**
    ```bash
    npx prisma db seed
    ```
6.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The backend will be running at `http://localhost:5001`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory (from the root):**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    - Create a `.env.local` file: `cp .env.local.example .env.local`
    - The default `VITE_API_BASE_URL` should already be correctly set to `http://localhost:5001/api`.
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`. You can now access the application in your browser.
