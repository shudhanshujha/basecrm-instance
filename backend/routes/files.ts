import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateUploadUrl, generateDownloadUrl, deleteStoredFile } from '../../lib/storage.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authMiddleware);

const getOrgId = async (req: any) => {
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};

function serializeFileRecord(record: any) {
  return {
    ...record,
    fileSize: record.fileSize != null ? Number(record.fileSize) : null,
  };
}

// List files for an entity
router.get('/list', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { assetId, dealId, invoiceId, clientId, expenseId, activityLogId } = req.query;

    const where: any = { orgId };
    if (assetId) where.assetId = assetId;
    if (dealId) where.dealId = dealId;
    if (invoiceId) where.invoiceId = invoiceId;
    if (clientId) where.clientId = clientId;
    if (expenseId) where.expenseId = expenseId;
    if (activityLogId) where.activityLogId = activityLogId;

    const files = await getPrisma().file.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Attach presigned download URLs
    const filesWithUrls = await Promise.all(
      files.map(async (f) => {
        try {
          const downloadUrl = await generateDownloadUrl(f.fileKey);
          return { ...serializeFileRecord(f), downloadUrl };
        } catch {
          return { ...serializeFileRecord(f), downloadUrl: null };
        }
      })
    );

    res.json(filesWithUrls);
  } catch (error: any) {
    console.error('[API ERROR] Failed to list files:', error);
    res.status(500).json({ error: error.message || 'Failed to list files' });
  }
});

// Get Presigned Upload URL
router.post('/upload', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { 
      fileName, 
      mimeType, 
      size, 
      assetId, 
      dealId, 
      activityLogId,
      invoiceId, 
      expenseId, 
      clientId 
    } = req.body;

    if (!fileName || !mimeType || !size) {
      return res.status(400).json({ error: 'Missing file metadata' });
    }

    if (size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 50MB limit' });
    }

    const fileId = uuidv4();
    const entityId = assetId || dealId || activityLogId || invoiceId || expenseId || clientId || 'general';
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `${orgId}/${entityId}/${fileId}-${safeFileName}`;

    const uploadUrl = await generateUploadUrl(fileKey, mimeType);

    const fileRecord = await getPrisma().file.create({
      data: {
        id: fileId,
        orgId: orgId,
        assetId: assetId || null,
        dealId: dealId || null,
        activityLogId: activityLogId || null,
        invoiceId: invoiceId || null,
        expenseId: expenseId || null,
        clientId: clientId || null,
        fileName: fileName,
        fileKey: fileKey,
        fileSize: BigInt(size),
        mimeType: mimeType,
        uploadedBy: req.user.id
      }
    });

    res.status(200).json({ uploadUrl, fileKey, fileRecord: serializeFileRecord(fileRecord) });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get Presigned Download URL
router.get('/download/:fileKey(*)', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const fileKey = req.params.fileKey;

    const fileRecord = await getPrisma().file.findFirst({
      where: { fileKey, orgId }
    });

    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    const downloadUrl = await generateDownloadUrl(fileKey);
    res.json({ downloadUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete File
router.delete('/delete/:fileKey(*)', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const fileKey = req.params.fileKey;

    const fileRecord = await getPrisma().file.findFirst({
      where: { fileKey, orgId }
    });

    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    await deleteStoredFile(fileKey);
    await getPrisma().file.delete({
      where: { id: fileRecord.id }
    });

    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
