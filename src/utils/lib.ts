import postgres from 'postgres'

type Db = ReturnType<typeof postgres>
let _sql: Db | null = null

export function getSql(): Db {
  if (_sql) return _sql
  const DB_URL = import.meta.env.SUPABASE_DB_URL
  if (!DB_URL) throw new Error('SUPABASE_DB_URL belum diset')
  _sql = postgres(DB_URL, { prepare: false, max: 1 })
  return _sql
}
