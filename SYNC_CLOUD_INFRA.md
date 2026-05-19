# MISSION: Cloud Infrastructure Sync for DrishtiVision CRM

## Context
We are migrating a local CRM (SQLite/Prisma) to a production-ready serverless architecture using Supabase (PostgreSQL) and Backblaze B2 (S3-Compatible).

## Objective
1. Apply the full SQL schema to the Supabase instance.
2. Configure CORS on the Backblaze B2 bucket to allow direct-to-storage uploads from the frontend.

---

## Task 1: Supabase Schema Application
**Target File:** `supabase/schema.sql`

**Instructions:**
- Read the content of `supabase/schema.sql`.
- If a `SUPABASE_DB_URL` (Postgres Connection String) is available in environment variables, use a PostgreSQL client (like `pg` or `psql`) to execute the script against the remote database.
- Ensure that the `get_my_org_id()` function and all RLS policies are created successfully.
- If no direct connection is available, notify the user to copy-paste the content into the Supabase SQL Editor.

---

## Task 2: Backblaze B2 CORS Configuration
**Credentials:** Found in `.env.local` (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME`)

**Instructions:**
- Use the AWS SDK (`@aws-sdk/client-s3`) to connect to the Backblaze B2 S3-compatible endpoint.
- Apply the following **CORS Configuration** to the bucket specified in `R2_BUCKET_NAME`:
  ```json
  {
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "GET", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3600
      }
    ]
  }
  ```
- This is critical for the frontend to perform direct PUT uploads.

---

## Task 3: Validation
- Verify that the `organizations` and `profiles` tables exist.
- Verify that RLS is enabled on the `files` table.
- Provide a summary of the infrastructure status.

---

## Environment Check
Ensure the following variables are loaded before execution:
- `SUPABASE_DB_URL` (For Task 1)
- `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME` (For Task 2)
