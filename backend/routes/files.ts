import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateUploadUrl, generateDownloadUrl, deleteFile } from '../../lib/r2.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Apply auth middleware
router.use(authMiddleware);

// Helper to get org_id
const getOrgId = async (req: any) => {
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};

// 1. Get Presigned Upload URL
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

    // 50MB limit
    if (size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 50MB limit' });
    }

    const fileId = uuidv4();
    const entityId = assetId || dealId || activityLogId || invoiceId || expenseId || clientId || 'general';
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `${orgId}/${entityId}/${fileId}-${safeFileName}`;

    // Generate R2 upload URL
    const uploadUrl = await generateUploadUrl(fileKey, mimeType);

    // Save metadata to DB
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

    // Convert BigInt for JSON serialization
    const responseRecord = {
      ...fileRecord,
      fileSize: (fileRecord.fileSize ?? BigInt(0)).toString()
    };

    res.status(200).json({ uploadUrl, fileKey, fileRecord: responseRecord });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 2. Get Presigned Download URL
router.get(/^\/(.+)$/, async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const fileKey = req.params[0];

    // Verify ownership in DB
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

// 3. Delete File
router.delete(/^\/(.+)$/, async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const fileKey = req.params[0];

    // Verify ownership
    const fileRecord = await getPrisma().file.findFirst({
      where: { fileKey, orgId }
    });

    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    // 1. Delete from R2
    await deleteFile(fileKey);
    
    // 2. Delete from DB
    await getPrisma().file.delete({
      where: { id: fileRecord.id }
    });

    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
