'use client';

import React, { useState } from 'react';
import { ChevronDown, X, Shield, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

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
  icon: string; // 'shield', 'file-text', etc.
  title: string;
  description: string;
  subcategories: AuditSubcategory[];
}

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-6 h-6" />,
  'file-text': <FileText className="w-6 h-6" />,
  'check-circle': <CheckCircle2 className="w-5 h-5" />,
  'alert-circle': <AlertCircle className="w-5 h-5" />,
  'x-circle': <XCircle className="w-5 h-5" />,
};

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

// Colores personalizados de la web
const webColors = {
  primary: '#7BF1A8',
  primaryDark: '#333333',
  background: '#f5f5f5',
  // Verde muy suave para fondos de secciones
  greenLight: '#f0fdf7',
  greenLighter: '#f8fffc',
};

export default function TechnicalAuditAccordion({ categories }: TechnicalAuditAccordionProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const [h1Title, setH1Title] = useState<string>('');

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
  };

  return (
    <div className="w-full space-y-4">
      {categories.map((category) => (
        <div key={category.id} className="border-2 rounded-lg overflow-hidden" style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}>
          {/* Level 1: Category Header */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-6 py-4 flex items-center justify-between transition hover:bg-gray-50"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center gap-4">
              <div style={{ color: webColors.primary }}>
                {iconMap[category.icon] || category.icon}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 text-lg">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Deselect all handler
                }}
                className="px-3 py-1 text-xs font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Desmarcar todo
              </button>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  expandedCategory === category.id ? 'rotate-180' : ''
                }`}
                style={{ color: webColors.primary }}
              />
            </div>
          </button>

          {/* Level 1 Content: Subcategories */}
          {expandedCategory === category.id && (
            <div className="border-t-2" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="border-b last:border-b-0" style={{ borderColor: webColors.background }}>
                  {/* Level 2: Subcategory Header */}
                  <button
                    onClick={() => toggleSubcategory(subcategory.id)}
                    className="w-full px-8 py-3 flex items-center justify-between transition hover:opacity-80"
                    style={{ backgroundColor: webColors.greenLight }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${categoryColorDot[subcategory.color]}`}></div>
                      <span className="font-medium text-gray-800">
                        {iconMap[subcategory.icon] || subcategory.icon} {subcategory.title} ({subcategory.checks.length} checks)
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedSubcategory === subcategory.id ? 'rotate-180' : ''
                      }`}
                      style={{ color: webColors.primary }}
                    />
                  </button>

                  {/* Level 3: H1 Title Input (Content Title only) */}
                  {expandedSubcategory === subcategory.id && subcategory.id === 'content-title' && (
                    <div className="px-8 py-4 border-t" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">H1 Título:</label>
                        <input
                          type="text"
                          value={h1Title}
                          onChange={(e) => setH1Title(e.target.value)}
                          placeholder="Ej: 5 trucos para encender carbón"
                          className="w-full px-4 py-2 border-2 rounded-lg text-sm focus:outline-none transition"
                          style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Level 3: Checks Grid */}
                  {expandedSubcategory === subcategory.id && (
                    <div className="px-8 py-4 border-t" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {subcategory.checks.map((check) => (
                          <div
                            key={check.id}
                            className={`p-3 rounded-lg border-2 flex items-center gap-2 cursor-pointer transition ${statusBadgeColor[check.status]}`}
                            style={{
                              backgroundColor: check.status === 'pass' ? '#f0fdf4' : check.status === 'fail' ? '#fef2f2' : '#fffbeb',
                              borderColor: check.status === 'pass' ? webColors.primary : undefined,
                            }}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded"
                              defaultChecked={check.status === 'pass'}
                              style={{ accentColor: webColors.primary }}
                              onChange={() => {
                                // Handle checkbox change
                              }}
                            />
                            <span className="text-xs font-medium truncate text-gray-800">{check.title}</span>
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
