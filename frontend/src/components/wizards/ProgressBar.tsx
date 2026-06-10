'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="w-full px-0">
      {/* Progress Bar - Linear Indicator */}
      <div className="mb-2">
        <div className="w-full bg-gray-200/60 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 text-xs font-semibold transition ${
              idx < currentStep
                ? 'text-green-600'
                : idx === currentStep
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                idx < currentStep
                  ? 'bg-green-100'
                  : idx === currentStep
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}
            >
              {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
