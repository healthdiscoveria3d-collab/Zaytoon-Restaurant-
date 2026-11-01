import pg from 'pg';

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
export const databaseEnabled = Boolean(databaseUrl);

let pool: pg.Pool | null = null;

export async function initializeDatabase() {
  if (!databaseUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL is required in production. Add it to the Render Web Service environment.');
    }
    return;
  }

  pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS zaytoon_records (
      collection TEXT NOT NULL,
      record_id TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (collection, record_id)
    )
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS zaytoon_records_collection_idx ON zaytoon_records (collection)');
  await pool.query('SELECT 1');
}

function getPool() {
  if (!pool) throw new Error('Database has not been initialized.');
  return pool;
}

export async function listRecords<T>(collection: string): Promise<T[]> {
  const result = await getPool().query(
    'SELECT data FROM zaytoon_records WHERE collection = $1 ORDER BY created_at ASC',
    [collection],
  );
  return result.rows.map((row: { data: T }) => row.data);
}

export async function getRecord<T>(collection: string, recordId: string): Promise<T | null> {
  const result = await getPool().query(
    'SELECT data FROM zaytoon_records WHERE collection = $1 AND record_id = $2 LIMIT 1',
    [collection, recordId],
  );
  return result.rows[0]?.data ?? null;
}

export async function saveRecord(collection: string, recordId: string, data: unknown): Promise<void> {
  await getPool().query(
    `INSERT INTO zaytoon_records (collection, record_id, data)
     VALUES ($1, $2, $3::jsonb)
     ON CONFLICT (collection, record_id)
     DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [collection, recordId, JSON.stringify(data)],
  );
}

export async function deleteRecord(collection: string, recordId: string): Promise<void> {
  await getPool().query(
    'DELETE FROM zaytoon_records WHERE collection = $1 AND record_id = $2',
    [collection, recordId],
  );
}
