import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userDataStr = searchParams.get('user');
    const errorMsg = searchParams.get('error');

    if (errorMsg) {
      // Hata varsa login sayfasına geri dön
      navigate(`/profil?error=${errorMsg}`, { replace: true });
      return;
    }

    if (userDataStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userDataStr));
        // localStorage'a user'ı kaydet
        localStorage.setItem('gezify_user', JSON.stringify(user));
        // Ana sayfaya yönlendir
        navigate('/', { replace: true });
      } catch (e) {
        console.error('Kullanıcı verisi ayrıştırılamadı:', e);
        navigate('/profil?error=ParseError', { replace: true });
      }
    } else {
      navigate('/profil', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-primary text-5xl animate-spin">
          progress_activity
        </span>
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Giriş yapılıyor, lütfen bekleyin...
        </h2>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
