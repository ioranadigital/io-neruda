'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import LanguageSelector, { Language } from '../selectors/LanguageSelector';
import StepContainer from './StepContainer';
import { Globe, Share2, Mail, Languages, ChevronDown, Package, Rocket, Zap, Trophy, MapPin, Briefcase, ShoppingCart, Target, Layout, Camera, Video, Sparkles, Clapperboard, BookOpen, User, MessageCircle, Handshake, Gift, HelpCircle, Volume2, Smartphone, Newspaper, Check } from 'lucide-react';

interface PasoFormatosProps {
  selectedClient: Client | null;
  formData: {
    selectedFormats: { [key: string]: { selected: boolean; subType?: string } };
    language: Language;
  };
  onChange: (data: { selectedFormats?: { [key: string]: { selected: boolean; subType?: string } }; language?: Language }) => void;
}

const SECTIONS = [
  {
    id: 'language',
    label: 'Idioma Contenido',
    icon: Globe,
    type: 'language',
  },
  {
    id: 'web_seo',
    label: 'Web & SEO',
    icon: '🌐',
    formats: [
      {
        id: 'blog',
        label: 'Blog Post / Artículo SEO',
        desc: '1,500-3,000 palabras',
        color: '#3b82f6',
        subFormats: [
          { id: 'blog_pillar', label: 'Contenido Pilar', desc: '1500-2500 palabras' },
          { id: 'blog_trend', label: 'Tendencia Rápida', desc: '500-800 palabras' },
          { id: 'blog_success', label: 'Caso de Éxito', desc: '800-1200 palabras' },
        ],
      },
      {
        id: 'landing',
        label: 'Landing Pages & Secciones Web',
        desc: 'Optimizada para conversión',
        color: '#3b82f6',
        subFormats: [
          { id: 'landing_local', label: 'Landing Local / Captación Geo-Targeted', desc: 'Enfoque SEO Local' },
          { id: 'landing_corporate', label: 'Landing de Servicio Corporativo', desc: 'B2B / Servicios profesionales' },
          { id: 'landing_product', label: 'Landing de Producto / Ficha de Venta', desc: 'Avanzada y optimizada' },
          { id: 'landing_squeeze', label: 'Squeeze Page / Captación de Leads', desc: 'Lead Magnet y conversion-focused' },
        ],
      },
    ],
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: Smartphone,
    formats: [
      {
        id: 'social_linkedin',
        label: 'LinkedIn',
        desc: 'Contenido profesional',
        color: '#ec4899',
        subFormats: [
          { id: 'linkedin_opinion', label: 'Post de Opinión / Liderazgo Intelectual', desc: 'Posicionamiento de autoridad' },
          { id: 'linkedin_carousel', label: 'Carrusel de Valor (PDF Informativo)', desc: 'Contenido educativo en capas' },
          { id: 'linkedin_launch', label: 'Post de Lanzamiento / Promoción', desc: 'Anuncio de producto/servicio' },
        ],
      },
      {
        id: 'social_instagram',
        label: 'Instagram',
        desc: 'Contenido visual atractivo',
        color: '#ec4899',
        subFormats: [
          { id: 'instagram_carousel', label: 'Caption para Carrusel de Valor', desc: 'Historias visuales impactantes' },
          { id: 'instagram_reel', label: 'Guion de Reel de Alta Retención', desc: 'Video corto viralizador' },
          { id: 'instagram_copy', label: 'Copy Estético + Hashtags', desc: 'Texto visual y discovery' },
        ],
      },
      {
        id: 'social_tiktok',
        label: 'TikTok',
        desc: 'Contenido viral corto',
        color: '#ec4899',
        subFormats: [
          { id: 'tiktok_educational', label: 'Guion Educativo / Curiosidades', desc: '30-60 segundos informativos' },
          { id: 'tiktok_ugc', label: 'Guion Reseña Estilo UGC', desc: 'Contenido generado por usuario' },
          { id: 'tiktok_reply', label: 'Respuesta a Comentario / Objeción', desc: 'Engagement comunitario' },
        ],
      },
      {
        id: 'social_facebook',
        label: 'Facebook',
        desc: 'Interacción comunitaria',
        color: '#ec4899',
        subFormats: [
          { id: 'facebook_community', label: 'Post Comunitario / Interacción Local', desc: 'Engagement con audiencia' },
          { id: 'facebook_offer', label: 'Post de Oferta Directa / Social Selling', desc: 'Conversión y venta' },
        ],
      },
    ],
  },
  {
    id: 'email',
    label: 'Email Mensajería',
    icon: Mail,
    formats: [
      {
        id: 'email',
        label: 'Email Marketing',
        desc: 'Newsletter efectiva',
        color: '#f59e0b',
        subFormats: [
          { id: 'email_newsletter', label: 'Newsletter Estándar', desc: 'Contenido e información semanal' },
          { id: 'email_promotional', label: 'Email Promocional / Oferta', desc: 'Convertir con descuentos' },
          { id: 'email_educational', label: 'Email Educativo / Secuencia', desc: 'Automatización de valor' },
        ],
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        desc: 'Mensaje directo y personal',
        color: '#f59e0b',
        subFormats: [
          { id: 'whatsapp_broadcast', label: 'Mensaje Broadcast / Anuncio', desc: 'Noticia a todos los contactos' },
          { id: 'whatsapp_support', label: 'Script de Soporte / FAQ', desc: 'Atención al cliente automático' },
          { id: 'whatsapp_sales', label: 'Mensaje de Venta Consultivo', desc: 'Cierre directo y personal' },
        ],
      },
    ],
  },
];

export default function PasoFormatos({
  selectedClient,
  formData,
  onChange,
}: PasoFormatosProps) {
  // Estado para controlar qué acordeones están abiertos
  const [expandedFormats, setExpandedFormats] = useState<{ [key: string]: boolean }>({});

  const toggleAccordion = (formatId: string) => {
    setExpandedFormats(prev => ({
      ...prev,
      [formatId]: !prev[formatId]
    }));
  };

  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona un cliente primero</p>
      </div>
    );
  }

  // Helper: Encontrar el formato padre de un sub-formato
  const getParentFormat = (subFormatId: string): string | null => {
    for (const section of SECTIONS) {
      if (section.formats) {
        for (const format of section.formats) {
          if (format.subFormats) {
            if (format.subFormats.some(sub => sub.id === subFormatId)) {
              return format.id;
            }
          }
        }
      }
    }
    return null;
  };

  // Helper: Obtener todos los sub-formatos de un formato padre
  const getSubFormatsForParent = (parentFormatId: string): string[] => {
    for (const section of SECTIONS) {
      if (section.formats) {
        const format = section.formats.find(f => f.id === parentFormatId);
        if (format && (format as any).subFormats) {
          return (format as any).subFormats.map((sub: any) => sub.id);
        }
      }
    }
    return [];
  };

  // Helper: Verificar si un formato tiene algún subformato seleccionado
  const hasSelectedSubFormats = (formatId: string): boolean => {
    const subFormats = getSubFormatsForParent(formatId);
    return subFormats.some(subId => formData.selectedFormats?.[subId]?.selected);
  };

  const handleFormatToggle = (formatId: string) => {
    const currentFormats = formData.selectedFormats || {};
    const isSelected = currentFormats[formatId]?.selected;

    // Comportamiento de toggle simple: si está seleccionado, deselecciona; si no, selecciona
    onChange({
      selectedFormats: {
        ...currentFormats,
        [formatId]: {
          ...currentFormats[formatId],
          selected: !isSelected,
        },
      },
    });
  };

  const selectedCount = Object.values(formData.selectedFormats || {}).filter(
    (f) => f.selected
  ).length;

  return (
    <StepContainer
      title="Formato de Salida"
      icon={Package}
      iconColor="slate"
      columns={1}
      gap="medium"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CONTENEDOR 1: Idioma Contenido */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Languages className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-700">Idioma Contenido</h3>
          </div>
          <p className="text-xs text-slate-500 ml-9 mb-4">Selecciona el idioma del contenido</p>
          <LanguageSelector
            value={formData.language}
            onChange={(lang) => onChange({ language: lang })}
          />
        </div>

        {/* CONTENEDOR 2: Web & SEO */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-700">Web & SEO</h3>
          </div>
          <div className="space-y-3">
            {SECTIONS.find((s) => s.id === 'web_seo')?.formats?.map((format) => {
              const isExpanded = expandedFormats[format.id] || false;
              const hasSelected = hasSelectedSubFormats(format.id);
              return (
                <div key={format.id}>
                  {/* Header con Acordeón */}
                  <button
                    onClick={() => toggleAccordion(format.id)}
                    className={`w-full border p-3 rounded-lg flex items-center justify-between transition ${
                      hasSelected
                        ? 'bg-purple-100 border-purple-300'
                        : 'bg-white border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-left flex-1">
                      <p className={`font-semibold text-sm ${
                        hasSelected ? 'text-purple-700' : 'text-slate-900'
                      }`}>{format.label}</p>
                      <p className={`text-xs mt-0.5 ${
                        hasSelected ? 'text-purple-600' : 'text-slate-500'
                      }`}>{format.desc}</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-purple-600 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Sub-formatos expandibles */}
                  {isExpanded && (format as any).subFormats && (
                    <div className="mt-2 pl-3 flex flex-col gap-2">
                      {(format as any).subFormats.map((sub: any) => {
                        const subIsSelected = formData.selectedFormats?.[sub.id]?.selected || false;
                        return (
                          <label
                            key={sub.id}
                            className={`flex items-start gap-2 p-2 rounded cursor-pointer transition ${
                              subIsSelected
                                ? 'bg-purple-50 border border-purple-200'
                                : 'hover:bg-purple-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={subIsSelected}
                              onChange={() => handleFormatToggle(sub.id)}
                              className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className={`text-xs font-medium ${
                                subIsSelected ? 'text-purple-700' : 'text-slate-700'
                              }`}>{sub.label}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{sub.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTENEDOR 3: Social Media */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-6 h-6 text-pink-600" />
            <h3 className="text-lg font-semibold text-pink-700">Social Media</h3>
          </div>
          <div className="space-y-3">
            {SECTIONS.find((s) => s.id === 'social')?.formats?.map((format) => {
              const isExpanded = expandedFormats[format.id] || false;
              const hasSelected = hasSelectedSubFormats(format.id);
              return (
                <div key={format.id}>
                  {/* Header con Acordeón */}
                  <button
                    onClick={() => toggleAccordion(format.id)}
                    className={`w-full border p-3 rounded-lg flex items-center justify-between transition ${
                      hasSelected
                        ? 'bg-pink-100 border-pink-300'
                        : 'bg-white border-slate-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-left flex-1">
                      <p className={`font-semibold text-sm ${
                        hasSelected ? 'text-pink-700' : 'text-slate-900'
                      }`}>{format.label}</p>
                      <p className={`text-xs mt-0.5 ${
                        hasSelected ? 'text-pink-600' : 'text-slate-500'
                      }`}>{format.desc}</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-pink-600 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Sub-formatos expandibles */}
                  {isExpanded && (format as any).subFormats && (
                    <div className="mt-2 pl-3 flex flex-col gap-2">
                      {(format as any).subFormats.map((sub: any) => {
                        const subIsSelected = formData.selectedFormats?.[sub.id]?.selected || false;
                        return (
                          <label
                            key={sub.id}
                            className={`flex items-start gap-2 p-2 rounded cursor-pointer transition ${
                              subIsSelected
                                ? 'bg-pink-50 border border-pink-200'
                                : 'hover:bg-pink-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={subIsSelected}
                              onChange={() => handleFormatToggle(sub.id)}
                              className="mt-0.5 rounded border-slate-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className={`text-xs font-medium ${
                                subIsSelected ? 'text-pink-700' : 'text-slate-700'
                              }`}>{sub.label}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{sub.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTENEDOR 4: Email Mensajería */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-700">Email Mensajería</h3>
          </div>
          <div className="space-y-3">
            {SECTIONS.find((s) => s.id === 'email')?.formats?.map((format) => {
              const isExpanded = expandedFormats[format.id] || false;
              const hasSelected = hasSelectedSubFormats(format.id);
              return (
                <div key={format.id}>
                  {/* Header con Acordeón */}
                  <button
                    onClick={() => toggleAccordion(format.id)}
                    className={`w-full border p-3 rounded-lg flex items-center justify-between transition ${
                      hasSelected
                        ? 'bg-amber-100 border-amber-300'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-left flex-1">
                      <p className={`font-semibold text-sm ${
                        hasSelected ? 'text-amber-700' : 'text-slate-900'
                      }`}>{format.label}</p>
                      <p className={`text-xs mt-0.5 ${
                        hasSelected ? 'text-amber-600' : 'text-slate-500'
                      }`}>{format.desc}</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-amber-600 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Sub-formatos expandibles */}
                  {isExpanded && (format as any).subFormats && (
                    <div className="mt-2 pl-3 flex flex-col gap-2">
                      {(format as any).subFormats.map((sub: any) => {
                        const subIsSelected = formData.selectedFormats?.[sub.id]?.selected || false;
                        return (
                          <label
                            key={sub.id}
                            className={`flex items-start gap-2 p-2 rounded cursor-pointer transition ${
                              subIsSelected
                                ? 'bg-amber-50 border border-amber-200'
                                : 'hover:bg-amber-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={subIsSelected}
                              onChange={() => handleFormatToggle(sub.id)}
                              className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className={`text-xs font-medium ${
                                subIsSelected ? 'text-amber-700' : 'text-slate-700'
                              }`}>{sub.label}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{sub.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumen Final - Full Width */}
      {selectedCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm font-semibold text-green-900">Listo para generar</p>
          </div>
          <p className="text-xs text-green-700 mt-2">
            Se generará contenido optimizado para: <br />
            <span className="font-medium">
              {Object.entries(formData.selectedFormats || {})
                .filter(([, f]) => f.selected)
                .map(([key]) => {
                  const allFormats = SECTIONS.flatMap((s) => s.formats || []);
                  const fmt = allFormats.find((f) => f.id === key);
                  return fmt?.label || key;
                })
                .join(', ')}
            </span>
          </p>
        </div>
      )}
    </StepContainer>
  );
}
