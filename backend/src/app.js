require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
require('./config/passport'); // run this file for its side effect

const app = express();

// Allow frontend to access API
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Finance Tracker API' });
});

const authRouter = require('./routes/auth.route');
app.use('/api/auth', authRouter);

const categoryRouter = require('./routes/category.route');
app.use('/api/categories', categoryRouter);

const transactionRouter = require('./routes/transaction.route');
app.use('/api/transactions', transactionRouter);

const reportsRouter = require('./routes/reports.route');
app.use('/api/reports', reportsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
