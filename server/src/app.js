// import express from 'express';
// import cors from 'cors';
// import authRoutes from './routes/authRoutes.js';
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// const app = express();

// app.use(cors({ origin: process.env.CLIENT_URL }));
// app.use(express.json());

// app.get('/api/health', (req, res) => {
//   res.status(200).json({ success: true, message: 'IssueFlow API is running' });
// });

// app.use('/api/auth', authRoutes);

// app.use(notFound);
// app.use(errorHandler);

// export default app;

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'IssueFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;