const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, '')); // strip trailing slashes

const corsOptions = {
  origin: function (origin, callback) {
    const normalizedOrigin = origin ? origin.replace(/\/+$/, '') : null;
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked origin: "${normalizedOrigin}" | Allowed: ${JSON.stringify(allowedOrigins)}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Expose these headers so the browser's fetch() API can read them.
  // Without this, Content-Disposition is hidden from JS when reading blob responses.
  exposedHeaders: ['Content-Disposition', 'Content-Type'],
};

module.exports = corsOptions;

