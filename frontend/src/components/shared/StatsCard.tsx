'use client';

import React from 'react';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  backgroundColor?: string;
  textColor?: string;
}

const bgColorMap = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  red: 'bg-red-50',
};

const textColorMap = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
};

const trendColorMap = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
};

export function StatsCard({
  icon,
  label,
  value,
  trend,
  trendValue,
  backgroundColor = 'blue',
  textColor = 'blue',
}: StatsCardProps) {
  const bgClass = (bgColorMap as Record<string, string>)[backgroundColor] || bgColorMap.blue;
  const textClass = (textColorMap as Record<string, string>)[textColor] || textColorMap.blue;
  const trendClass = trend ? (trendColorMap as Record<string, string>)[trend] : '';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className={`text-3xl font-bold ${textClass}`}>{value}</p>
          {trendValue && trend && (
            <p className={`text-sm mt-2 ${trendClass}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        <div className={`${bgClass} rounded-lg p-3 text-2xl`}>{icon}</div>
      </div>
    </div>
  );
}

export function StatGrid({ stats }: { stats: StatsCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatsCard key={idx} {...stat} />
      ))}
    </div>
  );
}
