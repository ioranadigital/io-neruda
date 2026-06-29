'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface StepFlowIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function StepFlowIndicator({
  currentStep,
  totalSteps,
  stepLabels,
}: StepFlowIndicatorProps) {
  return (
    <div className="w-full bg-white border-b border-slate-200 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Flow Title */}
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">
          Progreso del Wizard
        </p>

        {/* Steps Flow */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {stepLabels.map((label, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <React.Fragment key={index}>
                {/* Step Badge */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium"
                  style={isActive
                    ? { backgroundColor: '#e8f5ee', color: '#4aa87a', border: '1px solid #c8e6d4' }
                    : isCompleted
                    ? { backgroundColor: '#e8f5ee', color: '#4aa87a', border: '1px solid #c8e6d4' }
                    : { backgroundColor: '#f8fafc', color: '#94a3b8', border: '1px solid #e2e8f0' }
                  }
                >
                  {isCompleted ? (
                    <>
                      <Check size={16} className="flex-shrink-0" />
                      <span>{label}</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full">
                        {index}
                      </span>
                      <span>{label}</span>
                    </>
                  )}
                </div>

                {/* Separator */}
                {index < stepLabels.length - 1 && (
                  <div
                    className="h-1 w-4 rounded-full transition-all"
                    style={{ backgroundColor: isCompleted ? '#4aa87a' : '#e2e8f0' }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
