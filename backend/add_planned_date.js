const { Client } = require('pg');

const client = new Client({
  host: 'db.mqronanpwluzofvxnmmr.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'fenerbahçe386',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function addPlannedDate() {
  try {
    await client.connect();
    console.log('✅ Bağlandı.');
    await client.query(`
      ALTER TABLE public.routes 
      ADD COLUMN IF NOT EXISTS planned_date DATE;
    `);
    console.log('✅ planned_date kolonu eklendi.');
  } catch (err) {
    console.error('❌ Hata:', err.message);
  } finally {
    await client.end();
  }
}

addPlannedDate();
