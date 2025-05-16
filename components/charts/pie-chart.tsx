'use client';

import { useEffect, useRef } from 'react';
import {
    Chart,
    type ChartConfiguration,
    type ChartData,
    registerables,
} from 'chart.js';

Chart.register(...registerables);

interface PieChartProps {
    data: { name: string; value: number }[];
}

export function PieChart({ data }: PieChartProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Destroy existing chart
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        // Generate colors
        const colors = [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#8AC926',
            '#1982C4',
            '#6A4C93',
            '#FF595E',
        ];

        const chartData: ChartData = {
            labels: data.map((item) => item.name),
            datasets: [
                {
                    data: data.map((item) => item.value),
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 1,
                },
            ],
        };

        const config: ChartConfiguration = {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw as number;
                                const total = context.dataset.data.reduce(
                                    (a: number, b: number) => a + b,
                                    0
                                ) as number;
                                const percentage = Math.round(
                                    (value / total) * 100
                                );
                                return `${label}: ${percentage}% (${value})`;
                            },
                        },
                    },
                },
            },
        };

        chartInstance.current = new Chart(ctx, config);

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return (
        <div className='w-full h-64'>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
