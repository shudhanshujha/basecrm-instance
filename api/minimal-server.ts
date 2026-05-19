
import express from 'express';
import pingRoutes from '../backend/routes/ping';

const app = express();

app.use('/api/ping', pingRoutes);

app.get('/api/minimal-ping', (req, res) => {
  res.json({ status: 'minimal pong', env: process.env.DATABASE_URL ? 'PRESENT' : 'MISSING' });
});

export default app;
