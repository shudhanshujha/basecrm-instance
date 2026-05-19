
import express from 'express';

const app = express();

app.all('*', async (req, res) => {
  try {
    console.log('Loading backend/server...');
    const { default: backendApp } = await import('../backend/server.js');
    console.log('Backend loaded');
    return backendApp(req, res);
  } catch (error: any) {
    console.error('Error in api/index.ts:', error);
    res.status(500).send(`
      <h1>API Startup Error</h1>
      <pre>${error.message}</pre>
      <pre>${error.stack}</pre>
      <hr/>
      <p>Timestamp: ${new Date().toISOString()}</p>
    `);
  }
});

export default app;
