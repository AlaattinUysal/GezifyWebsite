// backend/server.js
// Gezify Auth Backend — Node.js + Express + SQLite

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('./auth');
const { initDatabase, findUserByEmail, createUser, getAllUsers } = require('./database');

const app = express();
const PORT = 3001;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Session ve Passport Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'gezify_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 gün
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gezify backend çalışıyor 🚀' });
});

// ── REGISTER ───────────────────────────────────────────────────────────────────
// POST /api/register
// Body: { name, email, password }
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasyon
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'İsim, email ve şifre zorunludur.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır.',
      });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir email adresi giriniz.',
      });
    }

    // Email zaten kayıtlı mı?
    const existingUser = await findUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.',
      });
    }

    // Şifreyi hashle (salt rounds: 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const newUser = await createUser(name.trim(), email.toLowerCase(), passwordHash);

    console.log(`✅ Yeni kullanıcı kaydedildi: ${email}`);

    return res.status(201).json({
      success: true,
      message: 'Hesap başarıyla oluşturuldu!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('Register hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası. Lütfen tekrar deneyin.',
    });
  }
});

// ── LOGIN ──────────────────────────────────────────────────────────────────────
// POST /api/login
// Body: { email, password }
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email ve şifre zorunludur.',
      });
    }

    // Kullanıcıyı bul
    const user = await findUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Bu email ile kayıtlı bir hesap bulunamadı.',
      });
    }

    // Şifreyi doğrula
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Hatalı şifre. Lütfen tekrar deneyin.',
      });
    }

    console.log(`✅ Kullanıcı giriş yaptı: ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Giriş başarılı!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Login hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası. Lütfen tekrar deneyin.',
    });
  }
});

// ── GET USER ───────────────────────────────────────────────────────────────────
// GET /api/user?email=...
app.get('/api/user', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email parametresi gerekli.' });
  }

  const user = await findUserByEmail(email.toLowerCase());
  if (!user) {
    return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    },
  });
});

// ── OAUTH ROUTES ───────────────────────────────────────────────────────────────

// GOOGLE
app.get('/auth/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect('http://localhost:5173/profil?error=GoogleConfigEksik');
  }
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/profil?error=GoogleAuthFailed' }),
  (req, res) => {
    // Başarılı giriş
    const user = req.user;
    // user'ı URL'e veya cookie'ye ekleyerek frontend'e dönebiliriz. 
    // Daha güvenli olan frontend'in callback sayfasında URL'den parametre okuması veya jwt kullanılmasıdır.
    // Şimdilik en basiti encodeURIComponent ile user objesini gönderelim
    const userData = encodeURIComponent(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    }));
    res.redirect(`http://localhost:5173/auth/callback?user=${userData}`);
  }
);

// FACEBOOK
app.get('/auth/facebook', (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return res.redirect('http://localhost:5173/profil?error=FacebookConfigEksik');
  }
  next();
}, passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: 'http://localhost:5173/profil?error=FacebookAuthFailed' }),
  (req, res) => {
    // Başarılı giriş
    const user = req.user;
    const userData = encodeURIComponent(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    }));
    res.redirect(`http://localhost:5173/auth/callback?user=${userData}`);
  }
);

// ── DEBUG: Tüm kullanıcılar (geliştirme ortamı için) ──────────────────────────
app.get('/api/users', async (req, res) => {
  const users = await getAllUsers();
  res.json({ success: true, count: users.length, users });
});

// ── Profil Güncelleme ─────────────────────────────────────────────────────────
app.put('/api/profile', async (req, res) => {
  const { id, name, currentPassword, newPassword } = req.body;
  if (!id || !name) return res.status(400).json({ message: 'id ve name zorunludur.' });
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    'https://mqronanpwluzofvxnmmr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcm9uYW5wd2x1em9mdnhubW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMwMDQzNCwiZXhwIjoyMDk0ODc2NDM0fQ.HGw48E_A3W347cPekUaxJyv1wEJeubeex8Ce2dj9YWg'
  );

  let updateData = { name };

  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ message: 'Mevcut şifrenizi girmelisiniz.' });
    
    // id'yi integer olarak sorgula
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    // Mevcut şifreyi doğrula
    const { data: userRecord, error: queryError } = await supabase
      .from('users')
      .select('id, password_hash')
      .eq('id', numericId)
      .single();

    console.log('Şifre değiştirme sorgusu → id:', numericId, '| user:', userRecord, '| hata:', queryError?.message);

    if (!userRecord) {
      return res.status(401).json({ message: 'Şifreyi doğrulayamadık. Lütfen tekrar deneyin.' });
    }
    if (!userRecord.password_hash || userRecord.password_hash.trim() === '') {
      return res.status(400).json({ message: 'Google veya Facebook ile giriş yapıldığı için şifre değiştirilemez.' });
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, userRecord.password_hash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Mevcut şifrenizi yanlış girdiniz.' });
    
    // Yeni şifreyi hashle
    const saltRounds = 10;
    updateData.password_hash = await bcrypt.hash(newPassword, saltRounds);
  }

  const { error } = await supabase.from('users').update(updateData).eq('id', id);
  if (error) return res.status(500).json({ message: 'Güncelleme başarısız.' });
  res.json({ success: true });
});


// ── Sunucuyu Başlat ────────────────────────────────────────────────────────────
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log('');
    console.log('🗺️  Gezify Auth Backend başlatıldı!');
    console.log(`🔗  http://localhost:${PORT}`);
    console.log(`📋  Sağlık kontrolü: http://localhost:${PORT}/api/health`);
    console.log(`👥  Kullanıcılar: http://localhost:${PORT}/api/users`);
    console.log('');
  });
}

startServer();
