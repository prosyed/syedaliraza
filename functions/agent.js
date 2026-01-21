import { neon } from '@neondatabase/serverless';

export async function handler(event) {
    await neon(process.env.DATABASE_URL).query("INSERT INTO agents (id, first_seen, last_seen) VALUES (gen_random_uuid(), now() AT TIME ZONE 'UTC', now() AT TIME ZONE 'UTC')");
}