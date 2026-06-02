import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Briefcase, Star, Bell, Settings, Activity } from 'lucide-react';
import AlertsModal from './AlertsModal';
import SettingsModal from './SettingsModal';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/markets', icon: TrendingUp, label: 'Markets' },
  { to: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/watchlist', icon: Star, label: 'Watchlist' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="w-64 h-screen flex flex-col border-r" style={{
        background: 'linear-gradient(180deg, #08080f 0%, #0a0a14 100%)',
        borderColor: '#1a1a2e'
      }}>
        <div className="px-6 py-6 border-b" style={{borderColor:'#1a1a2e'}}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{background:'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              <Activity size={18} color="white" strokeWidth={2.5}/>
            </div>
            <div>
              <h1 className="font-bold text-base" style={{color:'#e2e8f0'}}>WealthLens</h1>
              <p className="text-xs" style={{color:'#4a5568'}}>Finance Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                }}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8}
                  style={{color: active ? '#6366f1' : '#4a5568'}}/>
                <span className="text-sm font-medium" style={{color: active ? '#e2e8f0' : '#6b7280'}}>
                  {label}
                </span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{background:'#6366f1'}}/>}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 space-y-1 border-t pt-4" style={{borderColor:'#1a1a2e'}}>
          <button onClick={() => setShowAlerts(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5">
            <Bell size={18} strokeWidth={1.8} style={{color:'#4a5568'}}/>
            <span className="text-sm" style={{color:'#6b7280'}}>Alerts</span>
            <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{background:'#ef4444', color:'white'}}>3</div>
          </button>
          <button onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/5">
            <Settings size={18} strokeWidth={1.8} style={{color:'#4a5568'}}/>
            <span className="text-sm" style={{color:'#6b7280'}}>Settings</span>
          </button>

          <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl"
            style={{background:'rgba(255,255,255,0.03)'}}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              style={{background:'linear-gradient(135deg,#6366f1,#ec4899)', color:'white'}}>U</div>
            <div>
              <p className="text-sm font-medium" style={{color:'#e2e8f0'}}>Utkarsh</p>
              <p className="text-xs" style={{color:'#4a5568'}}>Pro Account</p>
            </div>
          </div>
        </div>
      </div>

      {showAlerts && <AlertsModal onClose={() => setShowAlerts(false)}/>}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)}/>}
    </>
  );
}
