'use client';

import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface AuditCheck {
  id: string;
  title: string;
  status: 'pass' | 'fail' | 'warning';
  description?: string;
}

interface AuditSubcategory {
  id: string;
  title: string;
  icon: string;
  color: 'red' | 'yellow' | 'green';
  checks: AuditCheck[];
}

interface AuditCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  subcategories: AuditSubcategory[];
}

interface TechnicalAuditAccordionProps {
  categories: AuditCategory[];
}

const statusBadgeColor = {
  pass: 'bg-green-100 text-green-800 border-green-300',
  fail: 'bg-red-100 text-red-800 border-red-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const categoryColorDot = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
};

export default function TechnicalAuditAccordion({ categories }: TechnicalAuditAccordionProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
  };

  return (
    <div className="w-full space-y-4">
      {categories.map((category) => (
        <div key={category.id} className="border border-gray-700 rounded-lg overflow-hidden bg-zinc-900">
          {/* Level 1: Category Header */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800 transition"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{category.icon}</span>
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">{category.title}</h3>
                <p className="text-sm text-gray-400">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Deselect all handler
                }}
                className="px-3 py-1 text-xs font-medium text-gray-300 hover:text-white transition"
              >
                Desmarcar todo
              </button>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  expandedCategory === category.id ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Level 1 Content: Subcategories */}
          {expandedCategory === category.id && (
            <div className="border-t border-gray-700 bg-zinc-950">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="border-b border-gray-800 last:border-b-0">
                  {/* Level 2: Subcategory Header */}
                  <button
                    onClick={() => toggleSubcategory(subcategory.id)}
                    className="w-full px-8 py-3 flex items-center justify-between hover:bg-zinc-900 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${categoryColorDot[subcategory.color]}`}></div>
                      <span className="font-medium text-gray-200">
                        {subcategory.icon} {subcategory.title} ({subcategory.checks.length} checks)
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        expandedSubcategory === subcategory.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Level 3: Checks Grid */}
                  {expandedSubcategory === subcategory.id && (
                    <div className="px-8 py-4 border-t border-gray-800 bg-zinc-900/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {subcategory.checks.map((check) => (
                          <div
                            key={check.id}
                            className={`p-3 rounded-lg border-2 flex items-center gap-2 cursor-pointer transition ${statusBadgeColor[check.status]}`}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded"
                              defaultChecked={check.status === 'pass'}
                              onChange={() => {
                                // Handle checkbox change
                              }}
                            />
                            <span className="text-xs font-medium truncate">{check.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
