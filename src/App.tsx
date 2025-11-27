import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer, NotFoundPage } from './components/layout';
import PageLoadingFallback from './components/layout/PageLoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';

// 遅延読み込み (Code Splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const PlayersListPage = lazy(() => import('./pages/PlayersListPage'));
const PlayerDetailPage = lazy(() => import('./pages/PlayerDetailPage'));
const TeamsListPage = lazy(() => import('./pages/TeamsListPage'));
const TeamDetailPage = lazy(() => import('./pages/TeamDetailPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#0D1117]">
          <Header />

          <main className="flex-grow">
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/players" element={<PlayersListPage />} />
                <Route path="/players/:playerId" element={<PlayerDetailPage />} />
                <Route path="/teams" element={<TeamsListPage />} />
                <Route path="/teams/:teamId" element={<TeamDetailPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
