import React from 'react';
import Header from '../components/Header';

const RoutesPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-text-light dark:text-text-dark font-display">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold">Tüm Rotalar</h1>
        <p className="mt-4">Keşfedilecek tüm rotalar burada listelenecek.</p>
      </div>
    </div>
  );
};

export default RoutesPage;