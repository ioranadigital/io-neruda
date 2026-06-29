'use client';

import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

const buttonClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  actions,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 ${sizeClasses[size]} w-full mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mb-6 text-gray-700">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="flex gap-3 justify-end">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  buttonClasses[action.variant || 'primary']
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
