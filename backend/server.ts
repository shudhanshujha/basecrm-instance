import express from 'express';
import cors from 'cors';
import clientRoutes from './routes/clients';
import siteRoutes from './routes/sites';
import vendorRoutes from './routes/vendors';
import campaignRoutes from './routes/campaigns';
import invoiceRoutes from './routes/invoices';
import expenseRoutes from './routes/expenses';
import analyticsRoutes from './routes/analytics';
import paymentRoutes from './routes/payments';
import backupRoutes from './routes/backup';

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get('/', (req, res) => {
  res.send('Drishti Vision CRM API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
