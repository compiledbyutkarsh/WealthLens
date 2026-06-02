import { useState } from 'react';
import { Star, Bell, Trash2, Plus } from 'lucide-react';
import { stocksWithHistory } from '../data/stockData';
import StockChart from '../components/StockChart';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState(['AAPL', 'NVDA', 'TSLA', 'META']);
  const [alerts, setAlerts] = useState({});

  const watched = stocksWithHistory.filter(s => watchlist.includes(s.symbol));
  const rest = stocksWithHistory.filter(s => !watchlist.includes(s.symbol));

  const remove = symbol => setWatchlist(w => w.filter(s => s !== symbol));
  const add = symbol => setWatchlist(w => [...w, symbol]);

  return (
    <div className="p-6" style={{background:'#050508', minHeight:'100vh'}}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{color:'#e2e8f0'}}>Watchlist</h1>
          <p className="text-sm mt-1" style={{color:'#4a5568'}}>Monitor your favourite stocks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {watched.map(s => (
          <div key={s.symbol} className="rounded-2xl p-5 transition-all hover:border-indigo-500/30"
            style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{background:`${s.color}20`, color:s.color}}>{s.symbol[0]}</div>
                <div>
                  <p className="font-bold" style={{color:'#e2e8f0'}}>{s.symbol}</p>
                  <p className="text-xs" style={{color:'#4a5568'}}>{s.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setAlerts(a => ({...a, [s.symbol]: !a[s.symbol]}))}
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    background: alerts[s.symbol] ? 'rgba(245,158,11,0.2)' : 'transparent',
                    color: alerts[s.symbol] ? '#f59e0b' : '#4a5568'
                  }}>
                  <Bell size={14}/>
                </button>
                <button onClick={() => remove(s.symbol)}
                  className="p-1.5 rounded-lg transition-all hover:bg-red-500/20"
                  style={{color:'#4a5568'}}>
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xl font-bold" style={{color:'#e2e8f0'}}>${s.currentPrice.toFixed(2)}</p>
              <span className="text-sm px-2 py-1 rounded-lg"
                style={{
                  background: s.changePct >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  color: s.changePct >= 0 ? '#10b981' : '#ef4444'
                }}>
                {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
              </span>
            </div>
            <StockChart data={s.history} color={s.color} height={80} showAxes={false} animated={false}/>
          </div>
        ))}
      </div>

      {/* Add more */}
      <div className="rounded-2xl p-5"
        style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
        <h3 className="font-semibold mb-4" style={{color:'#e2e8f0'}}>Add to Watchlist</h3>
        <div className="grid grid-cols-4 gap-3">
          {rest.map(s => (
            <div key={s.symbol} className="flex items-center justify-between p-3 rounded-xl"
              style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)'}}>
              <div>
                <p className="text-sm font-semibold" style={{color:'#e2e8f0'}}>{s.symbol}</p>
                <p className="text-xs" style={{color: s.changePct >= 0 ? '#10b981' : '#ef4444'}}>
                  {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                </p>
              </div>
              <button onClick={() => add(s.symbol)}
                className="p-1.5 rounded-lg transition-all hover:bg-indigo-500/20"
                style={{color:'#6366f1'}}>
                <Plus size={16}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
