import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Create database instance using the DATABASE_URL environment variable
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vayu_vihar';
const sql = postgres(connectionString);
export const db = drizzle(sql);
