'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import LanguageSelector, { Language } from '../selectors/LanguageSelector';
import StepContainer from './StepContainer';
import { Globe, Share2, Mail, Languages, ChevronDown, Package, Rocket, Zap, Trophy, MapPin, Briefcase, ShoppingCart, Target, Layout, Camera, Video, Sparkles, Clapperboard, BookOpen, User, MessageCircle, Handshake, Gift, HelpCircle, Volume2, Smartphone, Newspaper, Check, FileText, Layers, TrendingUp, Award, Linkedin, Instagram, Music, MessageSquare, Facebook, Send } from 'lucide-react';

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
        icon: FileText,
        subFormats: [
          { id: 'blog_pillar', label: 'Contenido Pilar', desc: '1500-2500 palabras', icon: Layers },
          { id: 'blog_trend', label: 'Tendencia Rápida', desc: '500-800 palabras', icon: TrendingUp },
          { id: 'blog_success', label: 'Caso de Éxito', desc: '800-1200 palabras', icon: Award },
        ],
      },
      {
        id: 'landing',
        label: 'Landing Pages & Secciones Web',
        desc: 'Optimizada para conversión',
        color: '#3b82f6',
        icon: Layout,
        subFormats: [
          { id: 'landing_local', label: 'Landing Local / Captación Geo-Targeted', desc: 'Enfoque SEO Local', icon: MapPin },
          { id: 'landing_corporate', label: 'Landing de Servicio Corporativo', desc: 'B2B / Servicios profesionales', icon: Briefcase },
          { id: 'landing_product', label: 'Landing de Producto / Ficha de Venta', desc: 'Avanzada y optimizada', icon: ShoppingCart },
          { id: 'landing_squeeze', label: 'Squeeze Page / Captación de Leads', desc: 'Lead Magnet y conversion-focused', icon: Target },
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
        icon: Linkedin,
        subFormats: [
          { id: 'linkedin_opinion', label: 'Post de Opinión / Liderazgo Intelectual', desc: 'Posicionamiento de autoridad', icon: Sparkles },
          { id: 'linkedin_carousel', label: 'Carrusel de Valor (PDF Informativo)', desc: 'Contenido educativo en capas', icon: Layers },
          { id: 'linkedin_launch', label: 'Post de Lanzamiento / Promoción', desc: 'Anuncio de producto/servicio', icon: Rocket },
        ],
      },
      {
        id: 'social_instagram',
        label: 'Instagram',
        desc: 'Contenido visual atractivo',
        color: '#ec4899',
        icon: Instagram,
        subFormats: [
          { id: 'instagram_carousel', label: 'Caption para Carrusel de Valor', desc: 'Historias visuales impactantes', icon: Layout },
          { id: 'instagram_reel', label: 'Guion de Reel de Alta Retención', desc: 'Video corto viralizador', icon: Video },
          { id: 'instagram_copy', label: 'Copy Estético + Hashtags', desc: 'Texto visual y discovery', icon: FileText },
        ],
      },
      {
        id: 'social_tiktok',
        label: 'TikTok',
        desc: 'Contenido viral corto',
        color: '#ec4899',
        icon: Music,
        subFormats: [
          { id: 'tiktok_educational', label: 'Guion Educativo / Curiosidades', desc: '30-60 segundos informativos', icon: BookOpen },
          { id: 'tiktok_ugc', label: 'Guion Reseña Estilo UGC', desc: 'Contenido generado por usuario', icon: User },
          { id: 'tiktok_reply', label: 'Respuesta a Comentario / Objeción', desc: 'Engagement comunitario', icon: MessageCircle },
        ],
      },
      {
        id: 'social_facebook',
        label: 'Facebook',
        desc: 'Interacción comunitaria',
        color: '#ec4899',
        icon: Facebook,
        subFormats: [
          { id: 'facebook_community', label: 'Post Comunitario / Interacción Local', desc: 'Engagement con audiencia', icon: Handshake },
          { id: 'facebook_offer', label: 'Post de Oferta Directa / Social Selling', desc: 'Conversión y venta', icon: ShoppingCart },
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
        icon: Mail,
        subFormats: [
          { id: 'email_newsletter', label: 'Newsletter Estándar', desc: 'Contenido e información semanal', icon: Newspaper },
          { id: 'email_promotional', label: 'Email Promocional / Oferta', desc: 'Convertir con descuentos', icon: Gift },
          { id: 'email_educational', label: 'Email Educativo / Secuencia', desc: 'Automatización de valor', icon: BookOpen },
        ],
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        desc: 'Mensaje directo y personal',
        color: '#f59e0b',
        icon: Send,
        subFormats: [
          { id: 'whatsapp_broadcast', label: 'Mensaje Broadcast / Anuncio', desc: 'Noticia a todos los contactos', icon: Share2 },
          { id: 'whatsapp_support', label: 'Script de Soporte / FAQ', desc: 'Atención al cliente automático', icon: HelpCircle },
          { id: 'whatsapp_sales', label: 'Mensaje de Venta Consultivo', desc: 'Cierre directo y personal', icon: Target },
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
    const parentFormat = getParentFormat(formatId);

    // Todas las categorías tienen restricción de 1 selección por formato padre
    if (!isSelected && parentFormat) {
      // Deseleccionar todos los sub-formatos del mismo padre
      const siblingSubs = getSubFormatsForParent(parentFormat);
      const updated = { ...currentFormats };

      // Deseleccionar todos los hermanos
      siblingSubs.forEach(subId => {
        if (updated[subId]) {
          updated[subId] = { ...updated[subId], selected: false };
        }
      });

      // Seleccionar solo el nuevo
      updated[formatId] = { ...currentFormats[formatId], selected: true };

      onChange({ selectedFormats: updated });
    } else if (isSelected) {
      // Si ya está seleccionado, permitir deseleccionar
      onChange({
        selectedFormats: {
          ...currentFormats,
          [formatId]: {
            ...currentFormats[formatId],
            selected: false,
          },
        },
      });
    }
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
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-700">Web & SEO</h3>
          </div>
          <p className="text-xs text-slate-500 ml-9 mb-4">Contenido para buscadores y web</p>
          <div className="space-y-4">
            {/* Nivel 1: Formatos principales (solo 1 seleccionable) */}
            <div className="space-y-2">
              {SECTIONS.find((s) => s.id === 'web_seo')?.formats?.map((format) => {
                const hasSelected = hasSelectedSubFormats(format.id);
                const isExpanded = expandedFormats[format.id] || false;
                return (
                  <div key={format.id}>
                    {/* Tarjeta de Formato (sin checkbox) */}
                    <button
                      onClick={() => toggleAccordion(format.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        isExpanded
                          ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-200'
                          : 'bg-white border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {(format as any).icon && React.createElement((format as any).icon, {
                          className: `w-5 h-5 mt-0.5 flex-shrink-0 transition ${
                            isExpanded ? 'text-purple-600' : 'text-slate-600'
                          }`
                        })}
                        <div className="flex-1">
                          <p className={`font-semibold text-sm transition ${
                            isExpanded ? 'text-purple-700' : 'text-slate-900'
                          }`}>{format.label}</p>
                          <p className={`text-xs mt-1 transition ${
                            isExpanded ? 'text-purple-600' : 'text-slate-500'
                          }`}>{format.desc}</p>
                        </div>
                      </div>
                    </button>

                    {/* Nivel 2: Sub-formatos (tarjetas clicables sin checkbox) */}
                    {isExpanded && (format as any).subFormats && (
                      <div className="mt-3 space-y-2 pl-2">
                        <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                          Selecciona solo una:
                          <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">Restringido</span>
                        </p>
                        {(format as any).subFormats.map((sub: any) => {
                          const subIsSelected = formData.selectedFormats?.[sub.id]?.selected || false;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleFormatToggle(sub.id)}
                              className={`w-full text-left p-3 rounded-lg border-2 transition ${
                                subIsSelected
                                  ? 'bg-purple-100 border-purple-400'
                                  : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {sub.icon && React.createElement(sub.icon, {
                                  className: `w-4 h-4 mt-0.5 flex-shrink-0 transition ${
                                    subIsSelected ? 'text-purple-600' : 'text-slate-600'
                                  }`
                                })}
                                <div className="flex-1">
                                  <p className={`text-xs font-medium transition ${
                                    subIsSelected ? 'text-purple-700' : 'text-slate-700'
                                  }`}>{sub.label}</p>
                                  <p className={`text-[11px] mt-1 transition ${
                                    subIsSelected ? 'text-purple-600' : 'text-slate-500'
                                  }`}>{sub.desc}</p>
                                </div>
                              </div>
                            </button>
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

        {/* CONTENEDOR 3: Social Media */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Share2 className="w-6 h-6 text-pink-600" />
            <h3 className="text-lg font-semibold text-pink-700">Social Media</h3>
          </div>
          <p className="text-xs text-slate-500 ml-9 mb-4">Contenido para redes sociales</p>
          <div className="space-y-4">
            {/* Nivel 1: Plataformas (sin checkbox) */}
            <div className="space-y-2">
              {SECTIONS.find((s) => s.id === 'social')?.formats?.map((format) => {
                const hasSelected = hasSelectedSubFormats(format.id);
                const isExpanded = expandedFormats[format.id] || false;
                return (
                  <div key={format.id}>
                    {/* Tarjeta de Plataforma (sin checkbox) */}
                    <button
                      onClick={() => toggleAccordion(format.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        isExpanded
                          ? 'bg-pink-50 border-pink-400 ring-2 ring-pink-200'
                          : 'bg-white border-slate-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {(format as any).icon && React.createElement((format as any).icon, {
                          className: `w-5 h-5 mt-0.5 flex-shrink-0 transition ${
                            isExpanded ? 'text-pink-600' : 'text-slate-600'
                          }`
                        })}
                        <div className="flex-1">
                          <p className={`font-semibold text-sm transition ${
                            isExpanded ? 'text-pink-700' : 'text-slate-900'
                          }`}>{format.label}</p>
                          <p className={`text-xs mt-1 transition ${
                            isExpanded ? 'text-pink-600' : 'text-slate-500'
                          }`}>{format.desc}</p>
                        </div>
                      </div>
                    </button>

                    {/* Nivel 2: Tipos de contenido (tarjetas clicables sin checkbox) */}
                    {isExpanded && (format as any).subFormats && (
                      <div className="mt-3 space-y-2 pl-2">
                        <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                          Selecciona solo una:
                          <span className="inline-block px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-bold rounded">Restringido</span>
                        </p>
                        {(format as any).subFormats.map((sub: any) => {
                          const subIsSelected = formData.selectedFormats?.[sub.id]?.selected || false;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleFormatToggle(sub.id)}
                              className={`w-full text-left p-3 rounded-lg border-2 transition ${
                                subIsSelected
                                  ? 'bg-pink-100 border-pink-400'
                                  : 'bg-slate-50 border-slate-200 hover:border-pink-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {sub.icon && React.createElement(sub.icon, {
                                  className: `w-4 h-4 mt-0.5 flex-shrink-0 transition ${
                                    subIsSelected ? 'text-pink-600' : 'text-slate-600'
                                  }`
                                })}
                                <div className="flex-1">
                                  <p className={`text-xs font-medium transition ${
                                    subIsSelected ? 'text-pink-700' : 'text-slate-700'
                                  }`}>{sub.label}</p>
                                  <p className={`text-[11px] mt-1 transition ${
                                    subIsSelected ? 'text-pink-600' : 'text-slate-500'
                                  }`}>{sub.desc}</p>
                                </div>
                              </div>
                            </button>
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

        {/* CONTENEDOR 4: Email Mensajería */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-700">Email Mensajería</h3>
          </div>
          <p className="text-xs text-slate-500 ml-9 mb-4">Comunicación directa por email y chat</p>
          <div className="space-y-4">
            {/* Nivel 1: Tipos de email (sin checkbox) */}
            <div className="space-y-2">
              {SECTIONS.find((s) => s.id === 'email')?.formats?.map((format) => {
                const hasSelected = hasSelectedSubFormats(format.id);
                const isExpanded = expandedFormats[format.id] || false;
                return (
                  <div key={format.id}>
                    {/* Tarjeta de Tipo Email (sin checkbox) */}
                    <button
                      onClick={() => toggleAccordion(format.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        isExpanded
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {(format as any).icon && React.createElement((format as any).icon, {
                          className: `w-5 h-5 mt-0.5 flex-shrink-0 transition ${
                            isExpanded ? 'text-amber-600' : 'text-slate-600'
                          }`
                        })}
                        <div className="flex-1">
                          <p className={`font-semibold text-sm transition ${
                            isExpanded ? 'text-amber-700' : 'text-slate-900'
                          }`}>{format.label}</p>
                          <p className={`text-xs mt-1 transition ${
                            isExpanded ? 'text-amber-600' : 'text-slate-500'
                          }`}>{format.desc}</p>
                        </div>
                      </div>
                    </button>

                    {/* Nivel 2: Variantes de email (tarjetas clicables sin checkbox) */}
                    {isExpanded && (format as any).subFormats && (
                      <div className="mt-3 space-y-2 pl-2">
                        <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                          Selecciona solo una:
                          <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">Restringido</span>
                        </p>
                        {(format as any).subFormats.map((sub: any) => {
                          const subIsSelected = formData.selectedFormats?.[sub.id]?.selected || false;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleFormatToggle(sub.id)}
                              className={`w-full text-left p-3 rounded-lg border-2 transition ${
                                subIsSelected
                                  ? 'bg-amber-100 border-amber-400'
                                  : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {sub.icon && React.createElement(sub.icon, {
                                  className: `w-4 h-4 mt-0.5 flex-shrink-0 transition ${
                                    subIsSelected ? 'text-amber-600' : 'text-slate-600'
                                  }`
                                })}
                                <div className="flex-1">
                                  <p className={`text-xs font-medium transition ${
                                    subIsSelected ? 'text-amber-700' : 'text-slate-700'
                                  }`}>{sub.label}</p>
                                  <p className={`text-[11px] mt-1 transition ${
                                    subIsSelected ? 'text-amber-600' : 'text-slate-500'
                                  }`}>{sub.desc}</p>
                                </div>
                              </div>
                            </button>
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
