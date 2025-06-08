const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes =  require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const skillExchangeRoutes = require('./routes/skillExchangeRoute.js');
const mentorRequestRoutes = require('./routes/mentorRequestRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const hiringRoutes = require('./routes/hiringRoutes.js');

require('dotenv').config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use('/api/auth',authRoutes);
const userRoutes = require('./routes/userRoutes.js');
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/skill-exchange', skillExchangeRoutes);
app.use('/api/mentor-requests', mentorRequestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/hiring', hiringRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));