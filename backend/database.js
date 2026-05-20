// backend/database.js
// sql.js tabanlı SQLite yönetimi — derleme gerektirmez (pure JS)

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'gezify.db');

let db = null;

/**
 * Veritabanını başlatır. Dosya varsa yükler, yoksa yeni oluşturur.
 */
async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('✅ Mevcut veritabanı yüklendi:', DB_PATH);
  } else {
    db = new SQL.Database();
    console.log('🆕 Yeni veritabanı oluşturuldu:', DB_PATH);
  }

  // Kullanıcılar tablosunu oluştur (zaten varsa dokunma)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      google_id TEXT,
      facebook_id TEXT,
      avatar_url TEXT
    )
  `);

  // Mevcut tablo varsa ve yeni kolonlar yoksa ekle (Migration)
  try { db.run("ALTER TABLE users ADD COLUMN google_id TEXT;"); } catch (e) {}
  try { db.run("ALTER TABLE users ADD COLUMN facebook_id TEXT;"); } catch (e) {}
  try { db.run("ALTER TABLE users ADD COLUMN avatar_url TEXT;"); } catch (e) {}

  saveDatabase();
  console.log('✅ Kullanıcılar tablosu hazır.');
}

/**
 * Değişiklikleri diske yazar.
 */
function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

/**
 * Email ile kullanıcı bul.
 */
function findUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  stmt.bind([email]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

/**
 * Yeni kullanıcı oluştur.
 */
function createUser(name, email, passwordHash) {
  db.run(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  saveDatabase();

  // Oluşturulan kullanıcıyı geri döndür
  const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE email = ?');
  stmt.bind([email]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

/**
 * Tüm kullanıcıları listele (debug amaçlı).
 */
function getAllUsers() {
  const stmt = db.prepare('SELECT id, name, email, created_at FROM users');
  const users = [];
  while (stmt.step()) {
    users.push(stmt.getAsObject());
  }
  stmt.free();
  return users;
}

/**
 * OAuth ile kullanıcı bul veya oluştur.
 */
function findOrCreateOAuthUser(provider, profile) {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
  const name = profile.displayName || 'Kullanıcı';
  const avatar_url = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
  const providerId = profile.id;

  if (!email) {
    throw new Error('OAuth provider did not return an email address.');
  }

  // Önce bu email ile kayıtlı bir kullanıcı var mı bak
  let user = findUserByEmail(email);

  if (user) {
    // Kullanıcı var, sadece sağlayıcı id'sini ve (opsiyonel) avatarı güncelle
    let updateQuery = '';
    let params = [];
    if (provider === 'google') {
      updateQuery = 'UPDATE users SET google_id = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?';
      params = [providerId, avatar_url, user.id];
    } else if (provider === 'facebook') {
      updateQuery = 'UPDATE users SET facebook_id = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?';
      params = [providerId, avatar_url, user.id];
    }
    
    if (updateQuery) {
      db.run(updateQuery, params);
      saveDatabase();
      user = findUserByEmail(email); // güncel hali
    }
    return user;
  }

  // Kullanıcı yok, yeni oluştur
  const query = `
    INSERT INTO users (name, email, password_hash, ${provider === 'google' ? 'google_id' : 'facebook_id'}, avatar_url)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [name, email, '', providerId, avatar_url]); // Şifresiz oluşturuyoruz
  saveDatabase();

  return findUserByEmail(email);
}

module.exports = {
  initDatabase,
  saveDatabase,
  findUserByEmail,
  createUser,
  getAllUsers,
  findOrCreateOAuthUser,
};
