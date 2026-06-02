import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { stocksWithHistory, portfolio, newsItems } from '../data/stockData';
import StockChart from '../components/StockChart';

function StatCard({ title, value, change, icon: Icon, color, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), delay); }, []);
  const pos = change >= 0;

  return (
    <div className="rounded-2xl p-5 transition-all duration-700"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{background: `${color}20`, border: `1px solid ${color}30`}}>
          <Icon size={18} style={{color}}/>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg`}
          style={{
            background: pos ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: pos ? '#10b981' : '#ef4444'
          }}>
          {pos ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
          {Math.abs(change).toFixed(2)}%
        </div>
      </div>
      <p className="text-sm mb-1" style={{color:'#6b7280'}}>{title}</p>
      <p className="text-2xl font-bold" style={{color:'#e2e8f0'}}>{value}</p>
    </div>
  );
}

function TickerBar() {
  const tickers = stocksWithHistory.map(s => ({
    symbol: s.symbol,
    price: s.currentPrice.toFixed(2),
    pct: s.changePct.toFixed(2),
    pos: s.changePct >= 0
  }));

  return (
    <div className="overflow-hidden py-2 border-b" style={{borderColor:'#1a1a2e', background:'rgba(0,0,0,0.3)'}}>
      <div className="flex gap-8 whitespace-nowrap" style={{animation:'ticker 30s linear infinite'}}>
        {[...tickers, ...tickers].map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="font-bold" style={{color:'#e2e8f0'}}>{t.symbol}</span>
            <span style={{color:'#6b7280'}}>${t.price}</span>
            <span style={{color: t.pos ? '#10b981' : '#ef4444'}}>
              {t.pos ? '▲' : '▼'} {Math.abs(t.pct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const totalValue = portfolio.reduce((sum, p) => {
    const stock = stocksWithHistory.find(s => s.symbol === p.symbol);
    return sum + (stock?.currentPrice || 0) * p.shares;
  }, 0);

  const totalCost = portfolio.reduce((sum, p) => sum + p.avgCost * p.shares, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = (totalPnL / totalCost) * 100;

  const featured = stocksWithHistory[4]; // NVDA

  return (
    <div style={{background:'#050508', minHeight:'100vh'}}>
      <TickerBar />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{color:'#e2e8f0'}}>Good morning, Utkarsh 👋</h1>
            <p className="text-sm mt-1" style={{color:'#4a5568'}}>
              {new Date().toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric'})}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#10b981'}}>
            <div className="w-2 h-2 rounded-full bg-green-400" style={{animation:'pulse 2s infinite'}}/>
            Markets Open
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Portfolio Value" value={`$${totalValue.toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2})}`}
            change={totalPnLPct} icon={DollarSign} color="#6366f1" delay={0}/>
          <StatCard title="Total P&L" value={`${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`}
            change={totalPnLPct} icon={TrendingUp} color="#10b981" delay={100}/>
          <StatCard title="Day's Gain" value={`+$${(totalValue * 0.0142).toFixed(2)}`}
            change={1.42} icon={BarChart2} color="#8b5cf6" delay={200}/>
          <StatCard title="Market Cap" value="$2.87T" change={0.83} icon={TrendingDown} color="#f59e0b" delay={300}/>
        </div>

        {/* Main Chart + News */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Featured Stock Chart */}
          <div className="col-span-2 rounded-2xl p-5"
            style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{color:'#e2e8f0'}}>{featured.symbol}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{background:'rgba(99,102,241,0.15)', color:'#6366f1'}}>{featured.sector}</span>
                </div>
                <p className="text-sm mt-0.5" style={{color:'#6b7280'}}>{featured.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold" style={{color:'#e2e8f0'}}>${featured.currentPrice.toFixed(2)}</p>
                <p className="text-sm" style={{color: featured.changePct >= 0 ? '#10b981' : '#ef4444'}}>
                  {featured.changePct >= 0 ? '+' : ''}{featured.changePct.toFixed(2)}%
                </p>
              </div>
            </div>
            <StockChart data={featured.history} color={featured.color} height={220} showAxes={true}/>
          </div>

          {/* News */}
          <div className="rounded-2xl p-5"
            style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
            <h3 className="font-semibold mb-4 text-sm" style={{color:'#e2e8f0'}}>Market News</h3>
            <div className="space-y-3">
              {newsItems.map(n => (
                <div key={n.id} className="p-3 rounded-xl transition-all hover:bg-white/5 cursor-pointer"
                  style={{border:'1px solid rgba(255,255,255,0.04)'}}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: n.positive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: n.positive ? '#10b981' : '#ef4444'
                      }}>{n.tag}</span>
                    <span className="text-xs" style={{color:'#4a5568'}}>{n.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{color:'#9ca3af'}}>{n.title}</p>
                  <p className="text-xs mt-1" style={{color:'#4a5568'}}>{n.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-4 gap-3">
          {stocksWithHistory.slice(0, 4).map(s => (
            <div key={s.symbol} className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
              style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-sm" style={{color:'#e2e8f0'}}>{s.symbol}</p>
                  <p className="text-xs" style={{color:'#4a5568'}}>{s.sector}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: s.changePct >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: s.changePct >= 0 ? '#10b981' : '#ef4444'
                  }}>
                  {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                </span>
              </div>
              <p className="text-lg font-bold mb-2" style={{color:'#e2e8f0'}}>${s.currentPrice.toFixed(2)}</p>
              <StockChart data={s.history} color={s.color} height={60} showAxes={false} animated={false}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
