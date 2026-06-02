export const generatePriceHistory = (base, days, volatility = 0.02) => {
  const data = [];
  let price = base;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, base * 0.5);
    const open = price;
    const high = price * (1 + Math.random() * 0.02);
    const low = price * (1 - Math.random() * 0.02);
    const close = low + Math.random() * (high - low);
    const volume = Math.floor(Math.random() * 50000000 + 10000000);
    data.push({
      date: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
      price: +close.toFixed(2),
    });
  }
  return data;
};

export const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', base: 189.5, sector: 'Technology', color: '#6366f1' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', base: 415.2, sector: 'Technology', color: '#8b5cf6' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', base: 175.8, sector: 'Technology', color: '#06b6d4' },
  { symbol: 'TSLA', name: 'Tesla Inc.', base: 248.3, sector: 'Automotive', color: '#ec4899' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', base: 875.4, sector: 'Technology', color: '#10b981' },
  { symbol: 'AMZN', name: 'Amazon.com', base: 185.6, sector: 'E-Commerce', color: '#f59e0b' },
  { symbol: 'META', name: 'Meta Platforms', base: 512.3, sector: 'Social Media', color: '#3b82f6' },
  { symbol: 'JPM', name: 'JPMorgan Chase', base: 198.4, sector: 'Finance', color: '#84cc16' },
];

export const stocksWithHistory = stocks.map(s => ({
  ...s,
  history: generatePriceHistory(s.base, 365, 0.025),
  get currentPrice() { return this.history[this.history.length - 1].price; },
  get change() { return this.history[this.history.length - 1].price - this.history[this.history.length - 2].price; },
  get changePct() { return (this.change / this.history[this.history.length - 2].price) * 100; },
}));

export const portfolio = [
  { symbol: 'AAPL', shares: 25, avgCost: 165.3 },
  { symbol: 'MSFT', shares: 10, avgCost: 380.5 },
  { symbol: 'NVDA', shares: 5, avgCost: 620.0 },
  { symbol: 'TSLA', shares: 15, avgCost: 210.0 },
  { symbol: 'GOOGL', shares: 20, avgCost: 155.2 },
];

export const newsItems = [
  { id: 1, title: 'Fed signals potential rate cuts in Q3 2025', source: 'Reuters', time: '2h ago', tag: 'Macro', positive: true },
  { id: 2, title: 'NVIDIA surpasses $2T market cap milestone', source: 'Bloomberg', time: '4h ago', tag: 'Tech', positive: true },
  { id: 3, title: 'Apple Vision Pro sales exceed expectations', source: 'WSJ', time: '5h ago', tag: 'AAPL', positive: true },
  { id: 4, title: 'Tesla deliveries miss Q1 estimates by 8%', source: 'CNBC', time: '6h ago', tag: 'TSLA', positive: false },
  { id: 5, title: 'Microsoft Azure cloud revenue up 31% YoY', source: 'TechCrunch', time: '8h ago', tag: 'MSFT', positive: true },
  { id: 6, title: 'Inflation data shows cooling trend in services', source: 'FT', time: '10h ago', tag: 'Macro', positive: true },
];
