import React, { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop from '@/components/ScrollToTop';

import Index from '@/pages/index.jsx';
import Movies from './src/pages/movies.jsx';
import Series from '@/pages/series.jsx';
import Profile from '@/pages/profile.jsx';
import MediaDetail from '@/pages/mediadetail.jsx';
import Watchlist from '@/pages/watchlist.jsx';
import Favorites from '@/pages/favorites.jsx';
import SearchResults from '@/pages/searchresults.jsx';
import ActivateAccount from '@/pages/activate.jsx';

import AuthModal from '@/components/authmodal.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

export const openAuthModal = () =>
  window.dispatchEvent(new CustomEvent('auth:open'));
export const closeAuthModal = () =>
  window.dispatchEvent(new CustomEvent('auth:close'));

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  useEffect(() => {
    const onOpen = () => setShowAuthModal(true);
    const onClose = () => setShowAuthModal(false);
    window.addEventListener('auth:open', onOpen);
    window.addEventListener('auth:close', onClose);
    return () => {
      window.removeEventListener('auth:open', onOpen);
      window.removeEventListener('auth:close', onClose);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />

        <Route path="/movies/:id" element={<MediaDetail />} />
        <Route path="/series/:id" element={<MediaDetail />} />

        <Route path="/activate/:link" element={<ActivateAccount />} />
        <Route path="/search" element={<SearchResults />} />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}
