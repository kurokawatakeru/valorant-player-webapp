import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer, NotFoundPage } from './components/layout';
import PageLoadingFallback from './components/layout/PageLoadingFallback';

// 遅延読み込み (Code Splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const PlayersListPage = lazy(() => import('./pages/PlayersListPage'));
const PlayerDetailPage = lazy(() => import('./pages/PlayerDetailPage'));
const TeamsListPage = lazy(() => import('./pages/TeamsListPage'));
const TeamDetailPage = lazy(() => import('./pages/TeamDetailPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header />

        <main className="flex-grow">
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/players" element={<PlayersListPage />} />
              <Route path="/players/:playerId" element={<PlayerDetailPage />} />
              <Route path="/teams" element={<TeamsListPage />} />
              <Route path="/teams/:teamId" element={<TeamDetailPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
