import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { storage } from '../../lib/storage.js';
import { HeadBucketCommand } from '@aws-sdk/client-s3';

const router = Router();

router.get('/', async (req, res) => {
  const status: any = {
    api: 'live',
    database: 'checking',
    storage: 'checking',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };

  // 1. Check Database (Supabase via Prisma)
  try {
    // Attempt a simple query to verify connection
    const start = Date.now();
    await getPrisma().$queryRaw`SELECT 1`;
    status.database = 'connected';
    status.db_latency = `${Date.now() - start}ms`;
  } catch (error: any) {
    console.error('Health Check - Database Error:', error);
    const dbUrl = process.env.DATABASE_URL || 'not set';
    status.database = `disconnected: ${error.message}`;
    status.db_info = {
      type: dbUrl.startsWith('postgresql') ? 'PostgreSQL' : 'Unknown',
      hasUrl: !!process.env.DATABASE_URL,
      host: dbUrl.includes('@') ? dbUrl.split('@')[1].split(':')[0] : 'local',
      error: error.message
    };
  }

  // 2. Check Storage (Backblaze R2)
  try {
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) throw new Error('R2_BUCKET_NAME not configured');
    
    const start = Date.now();
    const command = new HeadBucketCommand({ Bucket: bucketName });
    await storage.send(command);
    status.storage = 'connected';
    status.storage_latency = `${Date.now() - start}ms`;
  } catch (error: any) {
    console.error('Health Check - Storage Error:', error);
    status.storage = `disconnected: ${error.message.substring(0, 100)}`;
    status.storage_config = {
      bucket: process.env.R2_BUCKET_NAME || 'missing',
      endpoint: process.env.R2_ENDPOINT || 'missing',
      hasAccessKey: !!process.env.R2_ACCESS_KEY_ID
    };
  }

  const isHealthy = status.database === 'connected' && status.storage === 'connected';
  
  // Add server info
  status.server = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: process.platform
  };

  res.status(isHealthy ? 200 : 207).json(status);
});

export default router;
