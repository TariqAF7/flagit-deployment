const dotenv = require('dotenv');

// Load env vars BEFORE importing modules that read process.env
dotenv.config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Logging in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/modules', require('./routes/module.routes'));
app.use('/api/simulations', require('./routes/simulation.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/admin/campaigns', require('./routes/campaign.routes'));
app.use('/api/admin/reports', require('./routes/report.routes'));
app.use('/api/maintainer', require('./routes/maintainer.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'FlagIt API is running', timestamp: new Date().toISOString() });
});

// Error handler (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 FlagIt server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
