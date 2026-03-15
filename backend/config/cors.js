const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Expose these headers so the browser's fetch() API can read them.
  // Without this, Content-Disposition is hidden from JS when reading blob responses.
  exposedHeaders: ['Content-Disposition', 'Content-Type'],
};

module.exports = corsOptions;
