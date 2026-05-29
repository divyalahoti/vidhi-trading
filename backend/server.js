const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');
const connectDB = require('./config/db');

dotenv.config();
dns.setDefaultResultOrder('ipv4first');
connectDB();

const app = express();

// Allow both localhost and Vercel frontend
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/categories',   require('./routes/categories'));
app.use('/api/subcategories',require('./routes/subcategories'));
app.use('/api/brands',       require('./routes/brands'));
app.use('/api/products',     require('./routes/products'));
app.use('/api/orders',       require('./routes/orders'));
app.use('/api/customers',    require('./routes/customers'));
app.use('/api/dashboard',    require('./routes/dashboard'));

app.get('/', (req, res) => res.json({ message: 'Vidhi Trading API Running' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;