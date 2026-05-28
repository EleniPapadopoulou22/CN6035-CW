require('dotenv').config();
const seatRoutes = require('./src/routes/seatRoutes');
const showtimeRoutes = require('./src/routes/showtimeRoutes');
const showRoutes = require('./src/routes/showRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');
const userRoutes = require('./src/routes/userRoutes');
const theatreRoutes = require('./src/routes/theatreRoutes');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CN6035 Theatre Reservations API is running',
  });
});

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/theatres', theatreRoutes);
app.use('/shows', showRoutes);
app.use('/showtimes', showtimeRoutes);
app.use('/seats', seatRoutes);
app.use('/reservations', reservationRoutes);
app.use('/user', userRoutes);
require('./src/config/db');

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

app.post('/auth/login-test', (req, res) => {
  res.json({
    success: true,
    message: 'Login test route works',
    body: req.body,
  });
});

app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});