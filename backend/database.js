const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mqronanpwluzofvxnmmr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcm9uYW5wd2x1em9mdnhubW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMwMDQzNCwiZXhwIjoyMDk0ODc2NDM0fQ.HGw48E_A3W347cPekUaxJyv1wEJeubeex8Ce2dj9YWg';

// Supabase istemcisini service role (admin) yetkisiyle oluşturuyoruz.
// Böylece RLS kurallarını bypass ederek arka planda kullanıcı işlemlerini rahatça yapabiliriz.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function initDatabase() {
  console.log('✅ Supabase bağlantısı başlatıldı.');
}

async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
    
  if (error) return null;
  return data;
}

async function createUser(name, email, passwordHash) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { name, email, password_hash: passwordHash }
    ])
    .select()
    .single();

  if (error) {
    console.error('createUser hatası:', error);
    return null;
  }
  return data;
}

async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, created_at');
    
  if (error) return [];
  return data;
}

async function findOrCreateOAuthUser(provider, profile) {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
  const name = profile.displayName || 'Kullanıcı';
  const avatar_url = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
  const providerId = profile.id;

  if (!email) {
    throw new Error('OAuth provider did not return an email address.');
  }

  let user = await findUserByEmail(email);

  if (user) {
    const updateData = {};
    if (provider === 'google') updateData.google_id = providerId;
    if (provider === 'facebook') updateData.facebook_id = providerId;
    if (!user.avatar_url && avatar_url) updateData.avatar_url = avatar_url;

    if (Object.keys(updateData).length > 0) {
      const { data } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
      if (data) user = data;
    }
    return user;
  }

  const insertData = {
    name,
    email,
    password_hash: '', // OAuth üzerinden girenlerin şifresi boş olabilir
    avatar_url
  };

  if (provider === 'google') insertData.google_id = providerId;
  if (provider === 'facebook') insertData.facebook_id = providerId;

  const { data, error } = await supabase
    .from('users')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('OAuth Create Error:', error);
    throw error;
  }

  return data;
}

module.exports = {
  initDatabase,
  findUserByEmail,
  createUser,
  getAllUsers,
  findOrCreateOAuthUser,
};
