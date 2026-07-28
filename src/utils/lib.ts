import postgres from 'postgres'

const DB_URL = import.meta.env.SUPABASE_DB_URL
if (!DB_URL) throw new Error('SUPABASE_DB_URL belum diset')

export const sql = postgres(DB_URL, { prepare: false, max: 1 })
