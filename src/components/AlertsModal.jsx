import { useState } from 'react';
import { X, Bell, Plus, Trash2 } from 'lucide-react';
import { stocksWithHistory } from '../data/stockData';

export default function AlertsModal({ onClose }) {
  const [alerts, setAlerts] = useState([
    { id: 1, symbol: 'AAPL', type: 'above', price: 200, active: true },
    { id: 2, symbol: 'NVDA', type: 'below', price: 900, active: true },
    { id: 3, symbol: 'TSLA', type: 'above', price: 260, active: false },
  ]);
  const [symbol, setSymbol] = useState('AAPL');
  const [type, setType] = useState('above');
  const [price, setPrice] = useState('');

  const add = () => {
    if (!price) return;
    setAlerts([...alerts, { id: Date.now(), symbol, type, price: parseFloat(price), active: true }]);
    setPrice('');
  };

  const remove = id => setAlerts(alerts.filter(a => a.id !== id));
  const toggle = id => setAlerts(alerts.map(a => a.id === id ? {...a, active: !a.active} : a));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)'}}>
      <div className="w-[500px] rounded-2xl overflow-hidden"
        style={{background:'#0d0d18', border:'1px solid rgba(255,255,255,0.08)'}}>

        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{background:'rgba(245,158,11,0.2)'}}>
              <Bell size={16} style={{color:'#f59e0b'}}/>
            </div>
            <h2 className="font-bold" style={{color:'#e2e8f0'}}>Price Alerts</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition">
            <X size={16} style={{color:'#6b7280'}}/>
          </button>
        </div>

        <div className="px-6 py-4 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
          <p className="text-xs font-medium mb-3" style={{color:'#6b7280'}}>NEW ALERT</p>
          <div className="flex gap-2">
            <select value={symbol} onChange={e => setSymbol(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
              style={{background:'rgba(255,255,255,0.05)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,0.08)'}}>
              {stocksWithHistory.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm outline-none"
              style={{background:'rgba(255,255,255,0.05)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,0.08)'}}>
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <input value={price} onChange={e => setPrice(e.target.value)}
              placeholder="Price" type="number"
              className="w-24 px-3 py-2 rounded-xl text-sm outline-none"
              style={{background:'rgba(255,255,255,0.05)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,0.08)'}}/>
            <button onClick={add}
              className="px-3 py-2 rounded-xl flex items-center gap-1 text-sm font-medium transition hover:opacity-90"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white'}}>
              <Plus size={14}/> Add
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-2 max-h-72 overflow-y-auto">
          {alerts.map(a => {
            const stock = stocksWithHistory.find(s => s.symbol === a.symbol);
            const triggered = a.type === 'above'
              ? stock?.currentPrice > a.price
              : stock?.currentPrice < a.price;
            return (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl"
                style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)'}}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full"
                    style={{background: a.active ? (triggered ? '#10b981' : '#f59e0b') : '#4a5568'}}/>
                  <div>
                    <p className="text-sm font-semibold" style={{color:'#e2e8f0'}}>
                      {a.symbol} {a.type} ${a.price}
                    </p>
                    <p className="text-xs" style={{color:'#4a5568'}}>
                      Current: ${stock?.currentPrice.toFixed(2)} · {triggered ? 'Triggered' : 'Watching'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(a.id)}
                    className="text-xs px-2 py-1 rounded-lg transition"
                    style={{
                      background: a.active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                      color: a.active ? '#10b981' : '#4a5568'
                    }}>
                    {a.active ? 'ON' : 'OFF'}
                  </button>
                  <button onClick={() => remove(a.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 transition"
                    style={{color:'#4a5568'}}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
