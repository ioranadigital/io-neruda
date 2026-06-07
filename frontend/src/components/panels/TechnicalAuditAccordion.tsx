'use client';

import React, { useState } from 'react';
import { ChevronDown, X, Shield, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import ToneSelector from '../selectors/ToneSelector';
import { KEYWORD_STRUCTURE } from '../../data/keywordStructure';
import FormatOutputSelector from './FormatOutputSelector';

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
  showToneSelectors?: boolean;
  showSimpleFields?: boolean;
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
  const [urlSlug, setUrlSlug] = useState<string>('');
  const [urlInterno1, setUrlInterno1] = useState<string>('');
  const [urlInterno2, setUrlInterno2] = useState<string>('');
  const [urlTone, setUrlTone] = useState<string>('professional');
  const [expandedKeywordLevel, setExpandedKeywordLevel] = useState<string | null>(null);

  // Initialize Level 6 (Exclusiones) keywords as pre-selected
  const initializeExcludedKeywords = () => {
    const level6 = KEYWORD_STRUCTURE.find((level) => level.id === 'level-6-exclude');
    if (level6) {
      const keywords = new Set<string>();
      level6.items.forEach((item) => {
        item.keywords.forEach((kw) => keywords.add(kw));
      });
      return keywords;
    }
    return new Set<string>();
  };

  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(initializeExcludedKeywords());
  const [h2Title, setH2Title] = useState<string>('');
  const [semanticElements, setSemanticElements] = useState<Record<string, boolean>>({
    lists: false,
    tables: false,
    blockquotes: false,
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
  };

  const toggleKeyword = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(keyword)) {
      newSelected.delete(keyword);
    } else {
      newSelected.add(keyword);
    }
    setSelectedKeywords(newSelected);
  };

  const toggleSemanticElement = (key: string) => {
    setSemanticElements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  expandedCategory === category.id ? 'rotate-180' : ''
                }`}
                style={{ color: webColors.primary }}
              />
          </button>

          {/* Level 1 Content: 6 Blocks (For Semantic Definition) */}
          {expandedCategory === category.id && category.showSimpleFields && (
            <div className="px-8 py-4 border-t-2" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Block 1: H1 Title */}
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Título H1:</label>
                  <input
                    type="text"
                    value={h1Title}
                    onChange={(e) => setH1Title(e.target.value)}
                    placeholder="Ej: 5 trucos para encender carbón"
                    className="w-full px-3 py-2 border-2 rounded-lg text-xs focus:outline-none transition"
                    style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Block 2: H2 Title */}
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Título H2:</label>
                  <input
                    type="text"
                    value={h2Title}
                    onChange={(e) => setH2Title(e.target.value)}
                    placeholder="Ej: Preparación inicial"
                    className="w-full px-3 py-2 border-2 rounded-lg text-xs focus:outline-none transition"
                    style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Block 3: Slug */}
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Slug de la URL:</label>
                  <input
                    type="text"
                    value={urlSlug}
                    onChange={(e) => setUrlSlug(e.target.value)}
                    placeholder="Ej: /barbacoas-jardin-terraza/"
                    className="w-full px-3 py-2 border-2 rounded-lg text-xs focus:outline-none transition"
                    style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Block 4: Enlace Interno 1 */}
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Enlace Interno 1:</label>
                  <input
                    type="text"
                    value={urlInterno1}
                    onChange={(e) => setUrlInterno1(e.target.value)}
                    placeholder="Ej: /blog/como-elegir-barbacoa/"
                    className="w-full px-3 py-2 border-2 rounded-lg text-xs focus:outline-none transition"
                    style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Block 5: Enlace Interno 2 */}
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Enlace Interno 2:</label>
                  <input
                    type="text"
                    value={urlInterno2}
                    onChange={(e) => setUrlInterno2(e.target.value)}
                    placeholder="Ej: /tienda/accesorios-barbacoa/"
                    className="w-full px-3 py-2 border-2 rounded-lg text-xs focus:outline-none transition"
                    style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Block 6: Semantic Elements Checklist */}
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm flex flex-col gap-3">
                  <label className="text-xs font-semibold text-gray-700">Elementos Semánticos:</label>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="lists-check"
                      checked={semanticElements.lists}
                      onChange={() => toggleSemanticElement('lists')}
                      className="w-4 h-4 mt-0.5 cursor-pointer accent-gray-800"
                    />
                    <label htmlFor="lists-check" className="text-xs text-gray-700 cursor-pointer flex-1">
                      Listas con viñetas (&lt;ul&gt;, &lt;li&gt;)
                    </label>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="tables-check"
                      checked={semanticElements.tables}
                      onChange={() => toggleSemanticElement('tables')}
                      className="w-4 h-4 mt-0.5 cursor-pointer accent-gray-800"
                    />
                    <label htmlFor="tables-check" className="text-xs text-gray-700 cursor-pointer flex-1">
                      Tablas comparativas (&lt;table&gt;)
                    </label>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="blockquotes-check"
                      checked={semanticElements.blockquotes}
                      onChange={() => toggleSemanticElement('blockquotes')}
                      className="w-4 h-4 mt-0.5 cursor-pointer accent-gray-800"
                    />
                    <label htmlFor="blockquotes-check" className="text-xs text-gray-700 cursor-pointer flex-1">
                      Bloques de cita / notas (&lt;blockquote&gt;)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Level 1 Content: Keywords Structure (For KW Definition) */}
          {expandedCategory === category.id && category.showToneSelectors && (
            <div className="px-8 py-4 border-t-2" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">Investigación y mapeo de palabras clave</h4>

                {/* Keywords Levels */}
                {KEYWORD_STRUCTURE.map((level) => (
                  <div key={level.id} className="border-2 rounded-lg overflow-hidden" style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}>
                    {/* Level Header */}
                    <button
                      onClick={() => setExpandedKeywordLevel(expandedKeywordLevel === level.id ? null : level.id)}
                      className="w-full px-4 py-3 flex items-center justify-between transition hover:bg-gray-50"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{level.icon}</span>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-gray-600">{level.level}</p>
                          <p className="text-sm font-bold text-gray-900">{level.title}</p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedKeywordLevel === level.id ? 'rotate-180' : ''
                        }`}
                        style={{ color: webColors.primary }}
                      />
                    </button>

                    {/* Level Content */}
                    {expandedKeywordLevel === level.id && (
                      <div className="px-4 py-4 border-t-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
                        {level.items.map((item) => (
                          <div key={item.id} className="p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                            <div className="mb-2">
                              <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                            </div>
                            {/* Keywords Tags */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.keywords.map((keyword) => (
                                <button
                                  key={keyword}
                                  onClick={() => toggleKeyword(keyword)}
                                  className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer border-2 ${
                                    selectedKeywords.has(keyword)
                                      ? 'border-gray-800 text-gray-900'
                                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                  style={{
                                    backgroundColor: selectedKeywords.has(keyword) ? webColors.primary : '#ffffff',
                                    color: selectedKeywords.has(keyword) ? '#333333' : '#666666',
                                  }}
                                >
                                  {keyword}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 1 Content: Special handling for content-quality */}
          {expandedCategory === category.id && category.id === 'content-quality' && (
            <div className="px-8 py-4 border-t-2" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
              <FormatOutputSelector />
            </div>
          )}

          {/* Level 1 Content: Tone Selector + Subcategories */}
          {expandedCategory === category.id && !category.showToneSelectors && category.id !== 'content-quality' && (
            <div className="border-t-2" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
              {/* Tone Selector Block (Strategy Section) */}
              {category.id === 'strategy-tone-approach' && (
                <div className="px-8 py-4 border-b-2" style={{ borderColor: webColors.primary }}>
                  <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                    <ToneSelector
                      selectedTone={urlTone}
                      onChange={(tone) => setUrlTone(tone)}
                    />
                  </div>
                </div>
              )}

              {/* Subcategories Section */}
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
                    <div className="px-8 py-4 border-t" style={{ borderColor: webColors.primary, backgroundColor: '#f3f4f6' }}>
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

                  {/* Level 3: URL Configuration Inputs (URL Config only) */}
                  {expandedSubcategory === subcategory.id && subcategory.id === 'url-config' && (
                    <div className="border-t" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
                      {/* Inputs Section */}
                      <div className="px-8 py-4" style={{ backgroundColor: '#f3f4f6' }}>
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Slug:</label>
                          <input
                            type="text"
                            value={urlSlug}
                            onChange={(e) => setUrlSlug(e.target.value)}
                            placeholder="Ej: trucos-encender-carbon"
                            className="w-full px-4 py-2 border-2 rounded-lg text-sm focus:outline-none transition"
                            style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Enlace Interno:</label>
                          <input
                            type="text"
                            value={urlInterno1}
                            onChange={(e) => setUrlInterno1(e.target.value)}
                            placeholder="Ej: /blog/trucos-encender-carbon"
                            className="w-full px-4 py-2 border-2 rounded-lg text-sm focus:outline-none transition"
                            style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
                          />
                        </div>
                      </div>

                      {/* 3-Column Tone Selector Grid */}
                      <div className="px-8 py-4 border-t" style={{ borderColor: webColors.primary }}>
                        <label className="block text-sm font-semibold text-gray-800 mb-4">Tono de Contenido:</label>
                        <div className="grid grid-cols-3 gap-4">
                          {/* Tone 1 */}
                          <div className="p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                            <ToneSelector
                              selectedTone={urlTone}
                              onChange={(tone) => setUrlTone(tone)}
                            />
                          </div>

                          {/* Tone 2 */}
                          <div className="p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                            <ToneSelector
                              selectedTone={urlTone}
                              onChange={(tone) => setUrlTone(tone)}
                            />
                          </div>

                          {/* Tone 3 */}
                          <div className="p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                            <ToneSelector
                              selectedTone={urlTone}
                              onChange={(tone) => setUrlTone(tone)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Level 3: Checks Grid or Format Output Selector */}
                  {expandedSubcategory === subcategory.id && (
                    <div className="px-8 py-4 border-t" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
                      {/* Special handling for content-quality (Formato de Salida) */}
                      {category.id === 'content-quality' ? (
                        <FormatOutputSelector />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {subcategory.checks.map((check) => (
                            <div
                              key={check.id}
                              className={`p-3 rounded-lg border-2 flex items-center justify-center cursor-pointer transition ${statusBadgeColor[check.status]}`}
                              style={{
                                backgroundColor: check.status === 'pass' ? '#f0fdf4' : check.status === 'fail' ? '#fef2f2' : '#fffbeb',
                                borderColor: check.status === 'pass' ? webColors.primary : undefined,
                              }}
                            >
                              <span className="text-xs font-medium truncate text-gray-800 text-center">{check.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
