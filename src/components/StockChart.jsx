import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function StockChart({ data, color = '#6366f1', height = 200, showAxes = true, animated = true }) {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState(null);
  const [range, setRange] = useState('1M');

  const ranges = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };

  const filtered = data.slice(-ranges[range]);
  const isPositive = filtered[filtered.length - 1]?.price >= filtered[0]?.price;
  const lineColor = isPositive ? '#10b981' : '#ef4444';

  useEffect(() => {
    if (!filtered.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = showAxes ? { top: 10, right: 16, bottom: 30, left: 50 } : { top: 4, right: 4, bottom: 4, left: 4 };
    const w = svgRef.current.clientWidth - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().domain(d3.extent(filtered, d => new Date(d.date))).range([0, w]);
    const y = d3.scaleLinear()
      .domain([d3.min(filtered, d => d.price) * 0.995, d3.max(filtered, d => d.price) * 1.005])
      .range([h, 0]);

    // Gradient
    const gradId = `grad-${Math.random().toString(36).slice(2)}`;
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', gradId).attr('x1','0').attr('x2','0').attr('y1','0').attr('y2','1');
    grad.append('stop').attr('offset','0%').attr('stop-color', lineColor).attr('stop-opacity', 0.3);
    grad.append('stop').attr('offset','100%').attr('stop-color', lineColor).attr('stop-opacity', 0);

    // Grid lines
    if (showAxes) {
      g.append('g').attr('class','grid').selectAll('line')
        .data(y.ticks(5)).enter().append('line')
        .attr('x1', 0).attr('x2', w)
        .attr('y1', d => y(d)).attr('y2', d => y(d))
        .attr('stroke', 'rgba(255,255,255,0.04)').attr('stroke-width', 1);
    }

    // Area
    const area = d3.area()
      .x(d => x(new Date(d.date)))
      .y0(h).y1(d => y(d.price))
      .curve(d3.curveCatmullRom);

    g.append('path').datum(filtered)
      .attr('fill', `url(#${gradId})`)
      .attr('d', area);

    // Line
    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.price))
      .curve(d3.curveCatmullRom);

    const path = g.append('path').datum(filtered)
      .attr('fill', 'none')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Animation
    if (animated) {
      const totalLength = path.node().getTotalLength();
      path.attr('stroke-dasharray', totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition().duration(1200).ease(d3.easeQuadInOut)
        .attr('stroke-dashoffset', 0);
    }

    // Axes
    if (showAxes) {
      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d')))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('text').attr('fill', '#4a5568').attr('font-size', '11px'))
        .call(g => g.selectAll('.tick line').attr('stroke', 'transparent'));

      g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d.toFixed(0)}`))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('text').attr('fill', '#4a5568').attr('font-size', '11px'))
        .call(g => g.selectAll('.tick line').attr('stroke', 'transparent'));
    }

    // Tooltip overlay
    const bisect = d3.bisector(d => new Date(d.date)).left;
    const focus = g.append('g').style('display', 'none');
    focus.append('circle').attr('r', 4).attr('fill', lineColor).attr('stroke', 'white').attr('stroke-width', 2);
    focus.append('line').attr('class','focus-line').attr('y1', 0).attr('y2', h)
      .attr('stroke', lineColor).attr('stroke-width', 1).attr('stroke-dasharray', '4,4').attr('opacity', 0.5);

    g.append('rect').attr('width', w).attr('height', h).attr('fill', 'transparent')
      .on('mousemove', function(event) {
        const [mx] = d3.pointer(event);
        const x0 = x.invert(mx);
        const i = bisect(filtered, x0, 1);
        const d = filtered[Math.min(i, filtered.length - 1)];
        if (!d) return;
        focus.style('display', null);
        focus.attr('transform', `translate(${x(new Date(d.date))},${y(d.price)})`);
        focus.select('.focus-line').attr('y1', h - y(d.price));
        setTooltip({ x: x(new Date(d.date)) + margin.left, y: y(d.price) + margin.top, price: d.price, date: d.date });
      })
      .on('mouseleave', () => { focus.style('display', 'none'); setTooltip(null); });

  }, [filtered, range, height, showAxes]);

  return (
    <div className="relative w-full">
      {showAxes && (
        <div className="flex gap-1 mb-3">
          {Object.keys(ranges).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="px-2.5 py-1 text-xs rounded-lg transition-all font-medium"
              style={{
                background: range === r ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: range === r ? '#6366f1' : '#4a5568',
                border: range === r ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent'
              }}>
              {r}
            </button>
          ))}
        </div>
      )}
      <svg ref={svgRef} width="100%" height={height}/>
      {tooltip && (
        <div className="absolute pointer-events-none z-10 px-3 py-2 rounded-xl text-xs font-medium"
          style={{
            left: tooltip.x + 8, top: tooltip.y - 30,
            background: 'rgba(10,10,20,0.95)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#e2e8f0', backdropFilter: 'blur(8px)'
          }}>
          <div style={{color: lineColor}}>${tooltip.price.toFixed(2)}</div>
          <div style={{color:'#4a5568'}}>{tooltip.date}</div>
        </div>
      )}
    </div>
  );
}
