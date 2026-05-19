import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables for local development
if (!process.env.VERCEL) {
  dotenv.config();
  dotenv.config({ path: '.env.local', override: true });
}

import clientRoutes from './routes/clients.js';
import siteRoutes from './routes/sites.js';
import vendorRoutes from './routes/vendors.js';
import campaignRoutes from './routes/campaigns.js';
import invoiceRoutes from './routes/invoices.js';
import expenseRoutes from './routes/expenses.js';
import analyticsRoutes from './routes/analytics.js';
import paymentRoutes from './routes/payments.js';
import backupRoutes from './routes/backup.js';
import storageRoutes from './routes/storage.js';
import notificationsRoutes from './routes/notifications.js';
import healthRoutes from './routes/health.js';
import fileRoutes from './routes/files.js';
import authRoutes from './routes/auth.js';
import debugRoutes from './routes/debug.js';
import pingRoutes from './routes/ping.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/ping', pingRoutes);


app.get('/api', (req, res) => {
  res.send('Drishti Vision CRM API is running...');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
