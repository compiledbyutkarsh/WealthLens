import { useState } from 'react';
import { X, Settings, User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsModal({ onClose }) {
  const [tab, setTab] = useState('profile');
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState({ email: true, push: false, alerts: true });

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'display', icon: Palette, label: 'Display' },
    { id: 'security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)'}}>
      <div className="w-[600px] rounded-2xl overflow-hidden"
        style={{background:'#0d0d18', border:'1px solid rgba(255,255,255,0.08)'}}>

        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{background:'rgba(99,102,241,0.2)'}}>
              <Settings size={16} style={{color:'#6366f1'}}/>
            </div>
            <h2 className="font-bold" style={{color:'#e2e8f0'}}>Settings</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <X size={16} style={{color:'#6b7280'}}/>
          </button>
        </div>

        <div className="flex">
          {/* Tabs */}
          <div className="w-44 border-r p-3 space-y-1" style={{borderColor:'rgba(255,255,255,0.06)'}}>
            {tabs.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                style={{
                  background: tab === id ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: tab === id ? '#6366f1' : '#6b7280'
                }}>
                <Icon size={15}/>
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {tab === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                    style={{background:'linear-gradient(135deg,#6366f1,#ec4899)', color:'white'}}>U</div>
                  <div>
                    <p className="font-bold" style={{color:'#e2e8f0'}}>Utkarsh Sachan</p>
                    <p className="text-sm" style={{color:'#4a5568'}}>Pro Account</p>
                  </div>
                </div>
                {[['Full Name','Utkarsh Sachan'],['Email','utkarshsachan2022@gmail.com'],['Username','utk4rsh.mean']].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs mb-1.5" style={{color:'#6b7280'}}>{label}</p>
                    <input defaultValue={val} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{background:'rgba(255,255,255,0.05)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,0.08)'}}/>
                  </div>
                ))}
              </div>
            )}

            {tab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Get alerts via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'alerts', label: 'Price Alerts', desc: 'Notify when price targets hit' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl"
                    style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div>
                      <p className="text-sm font-medium" style={{color:'#e2e8f0'}}>{label}</p>
                      <p className="text-xs mt-0.5" style={{color:'#4a5568'}}>{desc}</p>
                    </div>
                    <button onClick={() => setNotifications(n => ({...n, [key]: !n[key]}))}
                      className="w-11 h-6 rounded-full transition-all relative"
                      style={{background: notifications[key] ? '#6366f1' : 'rgba(255,255,255,0.1)'}}>
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
                        style={{left: notifications[key] ? '24px' : '4px'}}/>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'display' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs mb-2" style={{color:'#6b7280'}}>CURRENCY</p>
                  <div className="flex gap-2">
                    {['USD','EUR','GBP','INR'].map(c => (
                      <button key={c} onClick={() => setCurrency(c)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: currency === c ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                          border: currency === c ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
                          color: currency === c ? '#6366f1' : '#6b7280'
                        }}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{color:'#6b7280'}}>THEME</p>
                  <div className="flex gap-2">
                    {['Dark','Darker','Midnight'].map(t => (
                      <button key={t} className="px-4 py-2 rounded-xl text-sm transition-all"
                        style={{background:'rgba(255,255,255,0.05)', color:'#6b7280',
                          border:'1px solid rgba(255,255,255,0.08)'}}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="space-y-3">
                {[
                  { label: 'Change Password', desc: 'Update your account password' },
                  { label: 'Two-Factor Authentication', desc: '2FA via authenticator app' },
                  { label: 'Active Sessions', desc: 'Manage logged-in devices' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-white/5 transition"
                    style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div>
                      <p className="text-sm font-medium" style={{color:'#e2e8f0'}}>{label}</p>
                      <p className="text-xs mt-0.5" style={{color:'#4a5568'}}>{desc}</p>
                    </div>
                    <span style={{color:'#4a5568'}}>→</span>
                  </div>
                ))}
              </div>
            )}

            <button className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition hover:opacity-90"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white'}}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
