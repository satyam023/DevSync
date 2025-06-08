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

const allowedOrigins = [
  'http://localhost:5173',
  'https://devsync-dev.onrender.com',
  'https://devsync.onrender.com' // Add any other production domains
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or is a subdomain of your main domain
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.devsync-dev.onrender.com') ||
      origin.endsWith('.devsync.onrender.com')
    ) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  exposedHeaders: ['set-cookie'] // Important for cookie-based auth
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

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));