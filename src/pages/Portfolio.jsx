import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { stocksWithHistory, portfolio } from '../data/stockData';
import StockChart from '../components/StockChart';

export default function Portfolio() {
  const [selected, setSelected] = useState(null);

  const holdings = portfolio.map(p => {
    const stock = stocksWithHistory.find(s => s.symbol === p.symbol);
    const currentValue = stock.currentPrice * p.shares;
    const costBasis = p.avgCost * p.shares;
    const pnl = currentValue - costBasis;
    const pnlPct = (pnl / costBasis) * 100;
    return { ...p, stock, currentValue, costBasis, pnl, pnlPct };
  });

  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalCost  = holdings.reduce((s, h) => s + h.costBasis, 0);
  const totalPnL   = totalValue - totalCost;
  const totalPnLPct = (totalPnL / totalCost) * 100;

  const pieData = holdings.map(h => ({
    name: h.symbol, value: +h.currentValue.toFixed(2), color: h.stock.color
  }));

  const sel = selected ? holdings.find(h => h.symbol === selected) : null;

  return (
    <div className="p-6" style={{background:'#050508', minHeight:'100vh'}}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{color:'#e2e8f0'}}>Portfolio</h1>
          <p className="text-sm mt-1" style={{color:'#4a5568'}}>Track your holdings and performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white'}}>
          <Plus size={16}/> Add Position
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Value', value: `$${totalValue.toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2})}`, color: '#6366f1' },
          { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, color: totalPnL >= 0 ? '#10b981' : '#ef4444' },
          { label: 'Return', value: `${totalPnLPct >= 0 ? '+' : ''}${totalPnLPct.toFixed(2)}%`, color: totalPnLPct >= 0 ? '#10b981' : '#ef4444' },
        ].map(c => (
          <div key={c.label} className="rounded-2xl p-5"
            style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
            <p className="text-sm mb-2" style={{color:'#6b7280'}}>{c.label}</p>
            <p className="text-2xl font-bold" style={{color: c.color}}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Holdings Table */}
        <div className="col-span-2 rounded-2xl overflow-hidden"
          style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
          <div className="px-5 py-4 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
            <h3 className="font-semibold" style={{color:'#e2e8f0'}}>Holdings</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                {['Asset','Price','Shares','Value','P&L','Return'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium" style={{color:'#4a5568'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => (
                <tr key={h.symbol}
                  onClick={() => setSelected(selected === h.symbol ? null : h.symbol)}
                  className="cursor-pointer transition-all"
                  style={{
                    borderBottom:'1px solid rgba(255,255,255,0.03)',
                    background: selected === h.symbol ? 'rgba(99,102,241,0.08)' : 'transparent'
                  }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{background:`${h.stock.color}20`, color: h.stock.color}}>
                        {h.symbol[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{color:'#e2e8f0'}}>{h.symbol}</p>
                        <p className="text-xs" style={{color:'#4a5568'}}>{h.stock.sector}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{color:'#e2e8f0'}}>${h.stock.currentPrice.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm" style={{color:'#6b7280'}}>{h.shares}</td>
                  <td className="px-5 py-4 text-sm font-medium" style={{color:'#e2e8f0'}}>${h.currentValue.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm" style={{color: h.pnl >= 0 ? '#10b981' : '#ef4444'}}>
                    {h.pnl >= 0 ? '+' : ''}${h.pnl.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 rounded-lg font-medium"
                      style={{
                        background: h.pnlPct >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: h.pnlPct >= 0 ? '#10b981' : '#ef4444'
                      }}>
                      {h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sel && (
            <div className="px-5 py-4 border-t" style={{borderColor:'rgba(255,255,255,0.06)'}}>
              <p className="text-sm font-semibold mb-3" style={{color:'#e2e8f0'}}>{sel.stock.name} — Price History</p>
              <StockChart data={sel.stock.history} color={sel.stock.color} height={160} showAxes={true}/>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl p-5"
          style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)'}}>
          <h3 className="font-semibold mb-4" style={{color:'#e2e8f0'}}>Allocation</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent"/>
                ))}
              </Pie>
              <Tooltip
                contentStyle={{background:'rgba(10,10,20,0.95)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:'12px', color:'#e2e8f0'}}
                formatter={v => [`$${v.toLocaleString()}`, 'Value']}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {holdings.map(h => (
              <div key={h.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{background: h.stock.color}}/>
                  <span className="text-xs" style={{color:'#9ca3af'}}>{h.symbol}</span>
                </div>
                <span className="text-xs font-medium" style={{color:'#e2e8f0'}}>
                  {((h.currentValue / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
