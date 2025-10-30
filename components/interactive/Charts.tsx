"use client";
import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface BaseChartProps { config: ChartConfiguration; className?: string; }
export function BaseChart({ config, className }: BaseChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new Chart(canvasRef.current, config);
    return () => { c.destroy(); };
  }, [config]);
  return <canvas ref={canvasRef} className={className} />;
}

export function HorizontalBarChart({ data, className }: { data: number[]; className?: string }) {
  const labels = ['Engaged', 'Not Engaged', 'Actively Disengaged'];
  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Global Employee Engagement',
        data,
        backgroundColor: ['#3B82F6CC', '#FB923CCC', '#EF4444CC'],
        borderColor: ['#3B82F6', '#FB923C', '#EF4444'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: { y: { beginAtZero: true }, x: { ticks: { callback: (v: any) => v + '%' } } },
      plugins: { legend: { position: 'bottom' } }
    }
  };
  return <BaseChart config={config} className={className} />;
}

export function DonutChart({ labels, data, colors, className }: { labels: string[]; data: number[]; colors: string[]; className?: string }) {
  const config: ChartConfiguration = {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  };
  return <BaseChart config={config} className={className} />;
}
