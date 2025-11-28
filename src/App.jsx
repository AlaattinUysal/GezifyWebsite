import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import RoutesPage from './pages/RoutesPage';

function App() {
  return (
    <Routes>
      {/* "/" adresi ana sayfayı açar */}
      <Route path="/" element={<HomePage />} />
      
      {/* "/rotalar" adresi RoutesPage'i açar */}
      <Route path="/rotalar" element={<RoutesPage />} />
      
      {/* "/blog" adresi BlogPage'i açar */}
      <Route path="/blog" element={<BlogPage />} />
    </Routes>
  );
}

export default App;