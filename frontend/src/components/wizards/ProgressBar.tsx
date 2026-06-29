'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full px-0">
      {/* Linear progress indicator */}
      <div className="mb-2">
        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#d4ece0' }}>
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: '#4aa87a' }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 text-xs font-semibold transition"
            style={{
              color: idx < currentStep ? '#4aa87a' : idx === currentStep ? '#4aa87a' : '#9ca3af',
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]"
              style={{
                backgroundColor: idx < currentStep ? '#e8f5ee' : idx === currentStep ? '#4aa87a' : '#f3f4f6',
                color: idx < currentStep ? '#4aa87a' : idx === currentStep ? '#fff' : '#9ca3af',
              }}
            >
              {idx < currentStep ? <Check className="w-3 h-3" /> : idx + 1}
            </div>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
