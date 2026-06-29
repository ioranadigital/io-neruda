'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  className = '',
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6
        ${hoverable ? 'hover:shadow-lg transition' : ''}
        ${className}
      `}
    >
      {/* Header */}
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className="mb-4">{children}</div>

      {/* Footer */}
      {footer && <div className="border-t border-gray-200 pt-4">{footer}</div>}
    </div>
  );
}
