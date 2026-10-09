import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.SERVER_PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();