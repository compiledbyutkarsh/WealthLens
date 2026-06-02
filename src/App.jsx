import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Markets from './pages/Markets';
import Watchlist from './pages/Watchlist';

function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{background:'#050508'}}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/WealthLens">
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
        <Route path="/markets" element={<Layout><Markets /></Layout>} />
        <Route path="/watchlist" element={<Layout><Watchlist /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
