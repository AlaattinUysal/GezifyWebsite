// src/services/authService.js
// Gezify Auth API ile iletişim kuran servis

const API_URL = 'http://localhost:3001/api';
const USER_KEY = 'gezify_user';

/**
 * Yeni kullanıcı kaydı
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */
export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Kayıt sırasında bir hata oluştu.');
  }

  return data;
}

/**
 * Kullanıcı girişi
 * @param {string} email
 * @param {string} password
 * @param {boolean} rememberMe - localStorage'a kaydet
 */
export async function login(email, password, rememberMe = false) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Giriş sırasında bir hata oluştu.');
  }

  // Kullanıcı bilgisini kaydet
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(data.user));

  return data;
}

/**
 * Oturumu kapat
 */
export function logout() {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

/**
 * Mevcut oturumdaki kullanıcıyı döndürür
 * @returns {object|null}
 */
export function getCurrentUser() {
  const fromLocal = localStorage.getItem(USER_KEY);
  const fromSession = sessionStorage.getItem(USER_KEY);
  const raw = fromLocal || fromSession;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Kullanıcı giriş yapmış mı?
 * @returns {boolean}
 */
export function isLoggedIn() {
  return getCurrentUser() !== null;
}
