import { S3Client, CreateBucketCommand, PutBucketCorsCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

const KEY_ID = '0051d5efe7a49340000000001';
const APP_KEY = 'K005WOYRFHRXthfXrz+uVeFBG7gh5io';
const BUCKET_NAME = 'basecrm-files';
const REGION = 'us-east-005';
const ENDPOINT = `https://s3.${REGION}.backblazeb2.com`;

const s3 = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: KEY_ID,
    secretAccessKey: APP_KEY,
  },
});

async function setup() {
  try {
    console.log(`Ensuring bucket exists: ${BUCKET_NAME}...`);
    try {
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log('Bucket created successfully.');
    } catch (err) {
      if (err.Code === 'BucketAlreadyOwnedByYou' || err.Code === 'BucketAlreadyExists') {
        console.log('Bucket already exists and is owned by you.');
      } else {
        throw err;
      }
    }

    console.log('Setting CORS policy...');
    await s3.send(new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: ['*'], // In production, restrict this to your Vercel domain
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    }));
    console.log('CORS policy updated.');
    console.log(`SUCCESS! Use this endpoint: ${ENDPOINT}`);
  } catch (err) {
    console.error('Setup failed:', err);
    process.exit(1);
  }
}

setup();
