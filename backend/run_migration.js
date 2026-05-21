const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'db.mqronanpwluzofvxnmmr.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'fenerbahçe386',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    await client.connect();
    console.log('✅ Veritabanına bağlanıldı.');
    
    const sqlPath = path.join(__dirname, '..', 'routes_migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await client.query(sql);
    console.log('✅ Tablolar başarıyla oluşturuldu!');
    
  } catch (err) {
    console.error('❌ Hata:', err);
  } finally {
    await client.end();
  }
}

runMigration();
