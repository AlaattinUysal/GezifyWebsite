const { Client } = require('pg');

const client = new Client({
  host: 'db.mqronanpwluzofvxnmmr.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'fenerbahçe386',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixConstraint() {
  try {
    await client.connect();
    console.log('✅ Bağlandı.');

    // Foreign key constraint kaldır
    await client.query(`
      ALTER TABLE public.routes 
      DROP CONSTRAINT IF EXISTS routes_user_id_fkey;
    `);
    console.log('✅ Foreign key constraint kaldırıldı.');

    // RLS de kapalı olsun
    await client.query(`ALTER TABLE public.routes DISABLE ROW LEVEL SECURITY;`);
    console.log('✅ RLS devre dışı bırakıldı.');

  } catch (err) {
    console.error('❌ Hata:', err.message);
  } finally {
    await client.end();
  }
}

fixConstraint();
