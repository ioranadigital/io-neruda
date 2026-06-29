'use client';

import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StepContainerProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  columns?: 1 | 2 | 3 | '1-2' | '2-1';
  gap?: 'small' | 'medium' | 'large';
  actionButton?: ReactNode;
  children: ReactNode;
}

const gapClasses = {
  small: 'gap-3',
  medium: 'gap-6',
  large: 'gap-8',
};

const gridClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '1-2': 'grid-cols-1 sm:grid-cols-2',
  '2-1': 'grid-cols-1 sm:grid-cols-2',
};

export default function StepContainer({
  title,
  subtitle,
  icon: IconComponent,
  iconColor = 'blue',
  columns = 1,
  gap = 'medium',
  actionButton,
  children,
}: StepContainerProps) {
  return (
    <div className="space-y-6 w-full">
      {/* Header Container - Unified Green Theme */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {IconComponent && (
            <IconComponent size={28} className="flex-shrink-0 text-green-600" />
          )}
          <h2 className="text-xl font-bold text-green-700">{title}</h2>
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>

      {/* Content Grid */}
      <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]}`}>
        {columns === '1-2' ? (
          <>
            {React.Children.map(children, (child, index) => (
              <div key={index} className={index === 0 ? 'col-span-full' : ''}>
                {child}
              </div>
            ))}
          </>
        ) : columns === '2-1' ? (
          <>
            {React.Children.map(children, (child, index) => {
              const isLastChild = index === React.Children.count(children) - 1;
              return (
                <div key={index} className={isLastChild ? 'col-span-full' : ''}>
                  {child}
                </div>
              );
            })}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
