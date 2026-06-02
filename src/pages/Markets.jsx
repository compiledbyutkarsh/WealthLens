import { useState } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { stocksWithHistory } from '../data/stockData';
import StockChart from '../components/StockChart';

export default function Markets() {
  const [selected, setSelected] = useState(stocksWithHistory[0]);
  const [query, setQuery] = useState('');

  const filtered = stocksWithHistory.filter(s =>
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6" style={{background:'#050508', minHeight:'100vh'}}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{color:'#e2e8f0'}}>Markets</h1>
        <p className="text-sm mt-1" style={{color:'#4a5568'}}>Live market data and charts</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Stock List */}
        <div className="rounded-2xl overflow-hidden"
          style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
          <div className="p-4 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'#4a5568'}}/>
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search stocks..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
                style={{background:'rgba(255,255,255,0.05)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,0.08)'}}/>
            </div>
          </div>
          <div className="overflow-y-auto" style={{maxHeight:'600px'}}>
            {filtered.map(s => (
              <div key={s.symbol} onClick={() => setSelected(s)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer transition-all"
                style={{
                  borderBottom:'1px solid rgba(255,255,255,0.03)',
                  background: selected?.symbol === s.symbol ? 'rgba(99,102,241,0.1)' : 'transparent'
                }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{background:`${s.color}20`, color:s.color}}>{s.symbol[0]}</div>
                  <div>
                    <p className="text-sm font-semibold" style={{color:'#e2e8f0'}}>{s.symbol}</p>
                    <p className="text-xs truncate w-28" style={{color:'#4a5568'}}>{s.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium" style={{color:'#e2e8f0'}}>${s.currentPrice.toFixed(2)}</p>
                  <p className="text-xs" style={{color: s.changePct >= 0 ? '#10b981' : '#ef4444'}}>
                    {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Panel */}
        {selected && (
          <div className="col-span-2 rounded-2xl p-5"
            style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold" style={{color:'#e2e8f0'}}>{selected.symbol}</h2>
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{background:'rgba(99,102,241,0.15)', color:'#6366f1'}}>{selected.sector}</span>
                </div>
                <p style={{color:'#6b7280'}}>{selected.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold" style={{color:'#e2e8f0'}}>${selected.currentPrice.toFixed(2)}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {selected.changePct >= 0
                    ? <TrendingUp size={16} style={{color:'#10b981'}}/>
                    : <TrendingDown size={16} style={{color:'#ef4444'}}/>}
                  <span style={{color: selected.changePct >= 0 ? '#10b981' : '#ef4444'}}>
                    {selected.changePct >= 0 ? '+' : ''}{selected.changePct.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <StockChart data={selected.history} color={selected.color} height={280} showAxes={true}/>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Open', value: `$${selected.history[selected.history.length-1].open.toFixed(2)}` },
                { label: 'High', value: `$${selected.history[selected.history.length-1].high.toFixed(2)}` },
                { label: 'Low', value: `$${selected.history[selected.history.length-1].low.toFixed(2)}` },
                { label: 'Volume', value: `${(selected.history[selected.history.length-1].volume/1e6).toFixed(1)}M` },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-3 text-center"
                  style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)'}}>
                  <p className="text-xs mb-1" style={{color:'#4a5568'}}>{stat.label}</p>
                  <p className="text-sm font-semibold" style={{color:'#e2e8f0'}}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
