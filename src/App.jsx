// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import RoutesPage from './pages/RoutesPage';
import CreateRoutePage from './pages/CreateRoutePage'; // 1. YENİ IMPORT

function App() {
  return (
    <Routes>
      {/* "/" adresi ana sayfayı açar (DEĞİŞMEDİ) */}
      <Route path="/" element={<HomePage />} />
      
      {/* "/rotalar" adresi RoutesPage'i açar (DEĞİŞMEDİ) */}
      <Route path="/rotalar" element={<RoutesPage />} />
      
      {/* "/blog" adresi BlogPage'i açar (DEĞİŞMEDİ) */}
      <Route path="/blog" element={<BlogPage />} />

      {/* 2. YENİ ROTA: "/yeni-rota" adresi CreateRoutePage'i açar */}
      <Route path="/yeni-rota" element={<CreateRoutePage />} />
    </Routes>
  );
}

export default App;