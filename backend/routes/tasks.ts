import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

const getOrgId = async (req: any) => {
  if (req.user.orgId) return req.user.orgId;
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};

// Get all tasks for an org, with optional filters
router.get('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { status, priority, dealId, clientId, month, year } = req.query;

    const where: any = { orgId };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (dealId) where.dealId = dealId;
    if (clientId) where.clientId = clientId;

    // Filter by month/year
    if (month || year) {
      const y = parseInt(year as string) || new Date().getFullYear();
      const m = parseInt(month as string) || 0;
      if (m > 0) {
        where.dueDate = {
          gte: new Date(y, m - 1, 1),
          lt: new Date(y, m, 1),
        };
      } else {
        where.dueDate = {
          gte: new Date(y, 0, 1),
          lt: new Date(y + 1, 0, 1),
        };
      }
    }

    const tasks = await getPrisma().task.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('[API ERROR] Failed to fetch tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get upcoming tasks (next 7 days)
router.get('/upcoming', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await getPrisma().task.findMany({
      where: {
        orgId,
        status: { not: 'COMPLETED' },
        dueDate: { gte: now, lte: weekLater },
      },
      orderBy: { dueDate: 'asc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('[API ERROR] Failed to fetch upcoming tasks:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming tasks' });
  }
});

// Create a task
router.post('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const task = await getPrisma().task.create({
      data: {
        ...req.body,
        orgId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('[API ERROR] Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const existing = await getPrisma().task.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    // Auto-set completedAt
    const data = { ...req.body };
    if (data.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      data.completedAt = new Date();
    } else if (data.status !== 'COMPLETED') {
      data.completedAt = null;
    }

    const task = await getPrisma().task.update({
      where: { id },
      data,
    });

    res.json(task);
  } catch (error) {
    console.error(`[API ERROR] Failed to update task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const existing = await getPrisma().task.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    await getPrisma().task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(`[API ERROR] Failed to delete task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
