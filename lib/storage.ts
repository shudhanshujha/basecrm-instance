/*
STORAGE SETUP (S3-compatible — Backblaze B2):
1. Go to https://secure.backblazeb2.com
2. Create a Bucket (e.g. "basecrm-files") with "Private" access
3. Go to App Keys > Generate New Key with "Read & Write" access to the bucket
3. Copy Key ID, Application Key, and S3 Endpoint URL
4. Paste into .env.local:
   R2_ACCESS_KEY_ID=<key_id>
   R2_SECRET_ACCESS_KEY=<application_key>
   R2_ENDPOINT=https://s3.<region>.backblazeb2.com
   R2_BUCKET_NAME=basecrm-files
*/

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accessKeyId = process.env.R2_ACCESS_KEY_ID || 'missing';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || 'missing';
const endpoint = process.env.R2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com';
const bucketName = process.env.R2_BUCKET_NAME;

if (!bucketName) {
  console.error('R2_BUCKET_NAME environment variable is not set. File storage will fail.');
}

export const storage = new S3Client({
  region: 'us-east-005',
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
});

export async function generateUploadUrl(key: string, mimeType: string, expiresIn = 3600) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: mimeType,
  });
  return await getSignedUrl(storage, command, { expiresIn });
}

export async function generateDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return await getSignedUrl(storage, command, { expiresIn });
}

export async function deleteStoredFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  await storage.send(command);
}
