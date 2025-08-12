import React, { useMemo } from 'react';

export default function DataFlowMap(){
  const sources = useMemo(() => ([
    { id: 's1', name: 'Website', risk: 'Safe' },
    { id: 's2', name: 'Mobile App', risk: 'Review' },
    { id: 's3', name: 'Third-Party Forms', risk: 'High Risk' },
  ]), []);
  const processing = useMemo(() => ([
    { id: 'p1', name: 'Ingest Service', risk: 'Safe' },
    { id: 'p2', name: 'Analytics Pipeline', risk: 'Review' },
    { id: 'p3', name: 'CRM', risk: 'Safe' },
    { id: 'p4', name: 'Data Warehouse', risk: 'Review' },
  ]), []);
  const destinations = useMemo(() => ([
    { id: 'd1', name: 'Email Provider (US)', risk: 'High Risk' },
    { id: 'd2', name: 'Analytics (EU)', risk: 'Safe' },
    { id: 'd3', name: 'Support Desk (IN)', risk: 'Review' },
  ]), []);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">Data Flow Map</h1>
        <p className="text-sm text-gray-600">High-level view of sources, processing, and destinations</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <LegendDot color="bg-green-500" label="Green = Safe" />
        <LegendDot color="bg-amber-500" label="Amber = Review" />
        <LegendDot color="bg-red-500" label="Red = High Risk" />
      </div>

      {/* Diagram Placeholder */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="text-sm font-medium text-gray-900">Diagram</div>
          <div className="text-xs text-gray-500">Static SVG placeholder</div>
        </div>
        <div className="p-4">
          <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-100 sm:h-72 md:h-80">
            <SvgDiagram />
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Sources" items={sources} />
        <Card title="Processing" items={processing} />
        <Card title="Destinations" items={destinations} />
      </div>
    </div>
  );
}

function LegendDot({ color, label }){
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <span className={`inline-block h-3 w-3 rounded-full ${color}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function riskPill(risk){
  const map = {
    'Safe': 'bg-green-100 text-green-800 ring-green-200',
    'Review': 'bg-amber-100 text-amber-800 ring-amber-200',
    'High Risk': 'bg-red-100 text-red-700 ring-red-200',
  };
  const cls = map[risk] || 'bg-gray-100 text-gray-700 ring-gray-200';
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${cls}`}>{risk}</span>;
}

function Card({ title, items }){
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-medium text-gray-900">{title}</div>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="flex items-center justify-between gap-3 rounded-md border border-gray-100 px-3 py-2">
            <span className="text-sm text-gray-800">{i.name}</span>
            {riskPill(i.risk)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SvgDiagram(){
  // Simple static diagram with three columns and arrows
  return (
    <svg viewBox="0 0 900 300" role="img" aria-label="Static data flow diagram" className="h-full w-full">
      {/* Columns titles */}
      <text x="100" y="30" fontSize="14" fill="#111827" fontFamily="Inter, system-ui, -apple-system">Sources</text>
      <text x="420" y="30" fontSize="14" fill="#111827" fontFamily="Inter, system-ui, -apple-system">Processing</text>
      <text x="740" y="30" fontSize="14" fill="#111827" fontFamily="Inter, system-ui, -apple-system">Destinations</text>

      {/* Source nodes */}
      {node(60, 60, 180, 34, '#E5F9EA', '#10B981', 'Website')}
      {node(60, 110, 180, 34, '#FEF7E6', '#F59E0B', 'Mobile App')}
      {node(60, 160, 180, 34, '#FEEBEC', '#EF4444', '3rd-Party Forms')}

      {/* Processing nodes */}
      {node(380, 70, 180, 34, '#E5F9EA', '#10B981', 'Ingest')}
      {node(380, 120, 180, 34, '#FEF7E6', '#F59E0B', 'Analytics')}
      {node(380, 170, 180, 34, '#E5F9EA', '#10B981', 'CRM')}

      {/* Destination nodes */}
      {node(700, 90, 180, 34, '#FEEBEC', '#EF4444', 'Email (US)')}
      {node(700, 140, 180, 34, '#E5F9EA', '#10B981', 'Analytics (EU)')}
      {node(700, 190, 180, 34, '#FEF7E6', '#F59E0B', 'Support (IN)')}

      {/* Arrows from sources to processing */}
      {arrow(240, 77, 380, 87, '#6B7280')}
      {arrow(240, 127, 380, 132, '#6B7280')}
      {arrow(240, 177, 380, 177, '#6B7280')}

      {/* Arrows from processing to destinations */}
      {arrow(560, 87, 700, 107, '#6B7280')}
      {arrow(560, 137, 700, 147, '#6B7280')}
      {arrow(560, 187, 700, 197, '#6B7280')}
    </svg>
  );
}

function node(x, y, w, h, fill, stroke, label){
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={fill} stroke={stroke} />
      <text x={x + 12} y={y + h/2 + 5} fontSize="12" fill="#111827" fontFamily="Inter, system-ui, -apple-system">{label}</text>
    </g>
  );
}

function arrow(x1, y1, x2, y2, color){
  const head = 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - head} y2={y2} stroke={color} strokeWidth="1.5" />
      <polygon points={`${x2 - head},${y2 - 4} ${x2},${y2} ${x2 - head},${y2 + 4}`} fill={color} />
    </g>
  );
}
