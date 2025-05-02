import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';

// Create database instance using the DATABASE_URL environment variable
const sql = neon(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vayu_vihar');
export const db = drizzle(sql);
