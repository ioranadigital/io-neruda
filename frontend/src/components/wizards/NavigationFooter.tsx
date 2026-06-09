'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationFooterProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

export default function NavigationFooter({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isNextDisabled = false,
  isPreviousDisabled = currentStep === 0,
  nextLabel = 'Siguiente',
  previousLabel = 'Anterior',
}: NavigationFooterProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="w-full px-6 py-4 bg-white border-t border-gray-200 flex gap-3">
      {/* Anterior Button */}
      <button
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: isPreviousDisabled ? '#e5e7eb' : '#f3f4f6',
          color: isPreviousDisabled ? '#9ca3af' : '#374151',
        }}
      >
        <ChevronLeft size={18} />
        {previousLabel}
      </button>

      {/* Step Counter */}
      <div className="flex-1 flex items-center justify-center text-sm text-gray-600">
        Paso {currentStep + 1} de {totalSteps}
      </div>

      {/* Siguiente Button */}
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: isNextDisabled ? '#cbd5e1' : '#7BF1A8',
          color: isNextDisabled ? '#64748b' : '#000',
        }}
      >
        {isLastStep ? 'Finalizar' : nextLabel}
        {!isLastStep && <ChevronRight size={18} />}
      </button>
    </div>
  );
}
