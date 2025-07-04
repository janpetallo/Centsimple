require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./config/passport'); // run this file for its side effect

const app = express();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
