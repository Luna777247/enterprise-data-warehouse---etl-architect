
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DIM_PRODUCTS, FACT_SALES } from '../mockData';

const SchemaDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Data for the star schema diagram
    const nodes = [
      { id: 'fct_sales', label: 'FACT_SALES', type: 'fact', x: 400, y: 250 },
      { id: 'dim_products', label: 'DIM_PRODUCTS', type: 'dim', x: 150, y: 150 },
      { id: 'dim_customers', label: 'DIM_CUSTOMERS', type: 'dim', x: 650, y: 150 },
      { id: 'dim_date', label: 'DIM_DATE', type: 'dim', x: 150, y: 350 },
      { id: 'dim_region', label: 'DIM_REGION', type: 'dim', x: 650, y: 350 },
    ];

    const links = [
      { source: 'fct_sales', target: 'dim_products' },
      { source: 'fct_sales', target: 'dim_customers' },
      { source: 'fct_sales', target: 'dim_date' },
      { source: 'fct_sales', target: 'dim_region' },
    ];

    // Create links
    svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', d => nodes.find(n => n.id === d.source)!.x)
      .attr('y1', d => nodes.find(n => n.id === d.source)!.y)
      .attr('x2', d => nodes.find(n => n.id === d.target)!.x)
      .attr('y2', d => nodes.find(n => n.id === d.target)!.y)
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Create table cards
    const nodeGroups = svg.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x - 75}, ${d.y - 45})`);

    nodeGroups.append('rect')
      .attr('width', 150)
      .attr('height', 90)
      .attr('rx', 8)
      .attr('fill', d => d.type === 'fact' ? '#4f46e5' : '#ffffff')
      .attr('stroke', d => d.type === 'fact' ? '#4338ca' : '#e2e8f0')
      .attr('stroke-width', 2)
      .attr('class', 'shadow-sm');

    // Header
    nodeGroups.append('text')
      .attr('x', 75)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.type === 'fact' ? '#ffffff' : '#1e293b')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => d.label);

    // List some columns as preview
    nodeGroups.append('text')
      .attr('x', 15)
      .attr('y', 50)
      .attr('fill', d => d.type === 'fact' ? '#e0e7ff' : '#64748b')
      .attr('font-size', '10px')
      .text('• PK_ID');

    nodeGroups.append('text')
      .attr('x', 15)
      .attr('y', 65)
      .attr('fill', d => d.type === 'fact' ? '#e0e7ff' : '#64748b')
      .attr('font-size', '10px')
      .text('• DATE_KEY');

    nodeGroups.append('text')
      .attr('x', 15)
      .attr('y', 80)
      .attr('fill', d => d.type === 'fact' ? '#e0e7ff' : '#64748b')
      .attr('font-size', '10px')
      .text('• METRIC_VAL');

  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="font-semibold text-slate-800">Production Star Schema</h3>
          <p className="text-xs text-slate-500">Logical view of Sales Mart</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">Star Schema</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Optimized</span>
        </div>
      </div>
      <div className="p-6 flex justify-center overflow-auto">
        <svg ref={svgRef} width="800" height="500"></svg>
      </div>
    </div>
  );
};

export default SchemaDiagram;
