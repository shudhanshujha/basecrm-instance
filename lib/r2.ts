/*
R2 SETUP STEPS:
1. Go to https://dash.cloudflare.com
2. Left sidebar > R2 Object Storage > Create Bucket
3. Name it: crm-files
4. Go to R2 > Manage R2 API Tokens > Create API Token
5. Set permissions to Object Read & Write on your bucket
6. Copy Account ID, Access Key ID, Secret Access Key
7. Paste into .env.local
8. Optional: Enable public access on the bucket for direct file URLs
*/

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const r2 = new S3Client({
  region: 'us-east-005', // Matches your Backblaze endpoint region
  endpoint: process.env.R2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'missing',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'missing',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export async function generateUploadUrl(key: string, mimeType: string, expiresIn = 3600) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  });
  return await getSignedUrl(r2, command, { expiresIn });
}

export async function generateDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(r2, command, { expiresIn });
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  await r2.send(command);
}
