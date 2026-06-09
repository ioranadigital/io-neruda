'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import { Heading1, Heading2, Link2, MapPin, Globe, AlertCircle, Check } from 'lucide-react';
import StepContainer from './StepContainer';

interface PasoSEOGEOProps {
  selectedClient: Client | null;
  propuestaElegida: string | null;
  formData: {
    seoH1: string;
    seoH2: string;
    seoSlug: string;
    metaTitle: string;
    metaDescription: string;
    internalLink1: string;
    internalLink2: string;
    isLocalSEO: boolean;
    geoRegion: string;
    geoCiudad: string;
  };
  onChange: (data: {
    seoH1?: string;
    seoH2?: string;
    seoSlug?: string;
    metaTitle?: string;
    metaDescription?: string;
    internalLink1?: string;
    internalLink2?: string;
    isLocalSEO?: boolean;
    geoRegion?: string;
    geoCiudad?: string;
  }) => void;
}

// Sanitizador de slug: minúsculas, sin acentos, sin espacios
const sanitizeSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Elimina acentos
    .trim()
    .replace(/[^\w\s-]/g, '') // Elimina caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Guiones múltiples a uno
    .replace(/^-|-$/g, ''); // Elimina guiones al inicio/final
};

export default function PasoSEOGEO({
  selectedClient,
  propuestaElegida,
  formData,
  onChange,
}: PasoSEOGEOProps) {
  const [showLocalSEOAnimation, setShowLocalSEOAnimation] = useState(formData.isLocalSEO);

  // Estado para rastrear qué elementos han sido verificados
  const [verified, setVerified] = useState({
    metaTitle: false,
    metaDescription: false,
    h1: false,
    h2: false,
    slug: false,
    links: false,
    localSeo: false,
  });

  // Auto-generar seoSlug basado en seoH1 si no está establecido
  React.useEffect(() => {
    if (formData.seoH1 && !formData.seoSlug) {
      onChange({
        seoSlug: sanitizeSlug(formData.seoH1)
      });
    }
  }, [formData.seoH1]); // Genera slug automáticamente cuando H1 cambia

  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona un cliente primero</p>
      </div>
    );
  }

  const handleH1Change = (value: string) => {
    // Al cambiar H1, también actualiza slug automáticamente
    onChange({
      seoH1: value,
      seoSlug: sanitizeSlug(value)
    });
  };

  const handleSlugChange = (value: string) => {
    onChange({ seoSlug: sanitizeSlug(value) });
  };

  const handleLocalSEOToggle = (enabled: boolean) => {
    setShowLocalSEOAnimation(enabled);
    onChange({ isLocalSEO: enabled });
  };

  const toggleVerified = (key: keyof typeof verified) => {
    setVerified(prev => {
      const newVerified = { ...prev, [key]: !prev[key] };
      // Pasar estado de verificación al padre cuando cambia
      onChange({
        seoFieldsVerified: JSON.stringify(newVerified)
      } as any);
      return newVerified;
    });
  };

  const h1Length = formData.seoH1.length;
  const h1Exceeded = h1Length > 60;
  const metaTitleLength = formData.metaTitle.length;
  const metaTitleExceeded = metaTitleLength > 60;
  const metaDescLength = formData.metaDescription.length;
  const metaDescExceeded = metaDescLength > 155;

  const isLocalSEOValid = !formData.isLocalSEO || (formData.geoRegion && formData.geoCiudad);

  // Componente reutilizable para tarjeta con verificador
  const VerifiableCard = ({
    icon: Icon,
    title,
    color,
    children,
    verified: isVerified,
    onToggleVerified
  }: {
    icon: any;
    title: string;
    color: string;
    children: React.ReactNode;
    verified: boolean;
    onToggleVerified: () => void;
  }) => {
    const colorClasses = {
      blue: 'border-blue-200 hover:shadow-blue-100',
      purple: 'border-purple-200 hover:shadow-purple-100',
      amber: 'border-amber-200 hover:shadow-amber-100',
      green: 'border-green-200 hover:shadow-green-100',
      red: 'border-red-200 hover:shadow-red-100',
      orange: 'border-orange-200 hover:shadow-orange-100',
    };

    const iconColors = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      amber: 'text-amber-600',
      green: 'text-green-600',
      red: 'text-red-600',
      orange: 'text-orange-600',
    };

    const buttonColors = {
      blue: 'border-blue-300 text-blue-700 hover:bg-blue-50',
      purple: 'border-purple-300 text-purple-700 hover:bg-purple-50',
      amber: 'border-amber-300 text-amber-700 hover:bg-amber-50',
      green: 'border-green-300 text-green-700 hover:bg-green-50',
      red: 'border-red-300 text-red-700 hover:bg-red-50',
      orange: 'border-orange-300 text-orange-700 hover:bg-orange-50',
    };

    return (
      <div className={`bg-white border ${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-5 shadow-sm hover:shadow-md transition`}>
        {/* Header con icono y título */}
        <div className="flex items-center gap-2 mb-4">
          <Icon size={20} className={iconColors[color as keyof typeof iconColors]} />
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        </div>

        {/* Contenido */}
        <div className="space-y-3 mb-4">
          {children}
        </div>

        {/* Botón verificador */}
        <button
          onClick={onToggleVerified}
          className={`w-full py-2 px-3 rounded-lg border transition flex items-center justify-center gap-2 text-xs font-semibold ${
            isVerified
              ? `border-${color}-500 bg-${color}-50 text-${color}-700`
              : buttonColors[color as keyof typeof buttonColors]
          }`}
        >
          {isVerified ? (
            <>
              <Check size={16} />
              <span>Verificado</span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 border-2 rounded border-current" />
              <span>Verificar</span>
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <StepContainer
      title="Elementos SEO / GEO"
      icon={Globe}
      columns={1}
      gap="medium"
    >
      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-6">

          {/* Meta Title */}
          <VerifiableCard
            icon={Heading2}
            title="Meta Title"
            color="purple"
            verified={verified.metaTitle}
            onToggleVerified={() => toggleVerified('metaTitle')}
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">SERP Google</label>
              <span className={`text-xs font-bold ${metaTitleExceeded ? 'text-red-600' : 'text-green-600'}`}>
                {metaTitleLength} / 60
              </span>
            </div>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => onChange({ metaTitle: e.target.value })}
              placeholder="Aparece en resultados"
              className={`w-full px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border transition text-sm ${
                metaTitleExceeded
                  ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                  : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400'
              }`}
            />
            {metaTitleExceeded && (
              <div className="flex items-start gap-2 text-red-600 text-xs">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>Se truncará en Google</span>
              </div>
            )}
            <p className="text-xs text-slate-600 leading-tight">
              Aparece en Google • Influye en CTR
            </p>
          </VerifiableCard>

          {/* Meta Description */}
          <VerifiableCard
            icon={Heading2}
            title="Meta Descripción"
            color="amber"
            verified={verified.metaDescription}
            onToggleVerified={() => toggleVerified('metaDescription')}
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Resumen SERP</label>
              <span className={`text-xs font-bold ${metaDescExceeded ? 'text-red-600' : 'text-green-600'}`}>
                {metaDescLength} / 155
              </span>
            </div>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => onChange({ metaDescription: e.target.value })}
              placeholder="Resumen bajo H1 en Google"
              rows={3}
              className={`w-full px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border transition resize-none text-sm ${
                metaDescExceeded
                  ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                  : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400'
              }`}
            />
            {metaDescExceeded && (
              <div className="flex items-start gap-2 text-red-600 text-xs">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>Ideal 150-155 caracteres</span>
              </div>
            )}
            <p className="text-xs text-slate-600 leading-tight">
              Resumen en Google • CTR crítico
            </p>
          </VerifiableCard>

          {/* H1 Principal */}
          <VerifiableCard
            icon={Heading1}
            title="H1 Principal"
            color="blue"
            verified={verified.h1}
            onToggleVerified={() => toggleVerified('h1')}
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Título Página</label>
              <span className={`text-xs font-bold ${h1Exceeded ? 'text-red-600' : 'text-green-600'}`}>
                {h1Length} / 60
              </span>
            </div>
            <input
              type="text"
              value={formData.seoH1}
              onChange={(e) => handleH1Change(e.target.value)}
              placeholder="Auto-rellenado desde propuesta"
              className={`w-full px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border transition text-sm ${
                h1Exceeded
                  ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                  : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
              }`}
            />
            {h1Exceeded && (
              <div className="flex items-start gap-2 text-red-600 text-xs">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>Máx 60 caracteres para Google</span>
              </div>
            )}
            <p className="text-xs text-slate-600 leading-tight">
              Incluye palabra clave • Único y descriptivo
            </p>
          </VerifiableCard>

          {/* H2 Contenido */}
          <VerifiableCard
            icon={Heading2}
            title="H2 Contenido"
            color="green"
            verified={verified.h2}
            onToggleVerified={() => toggleVerified('h2')}
          >
            <label className="text-xs font-semibold text-slate-700 block mb-2">Primer Subtítulo</label>
            <input
              type="text"
              value={formData.seoH2}
              onChange={(e) => onChange({ seoH2: e.target.value })}
              placeholder="Primer subtítulo del contenido"
              className="w-full px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm transition"
            />
            <p className="text-xs text-slate-600 leading-tight mt-2">
              Apoya el H1 • Estructura jerárquica
            </p>
          </VerifiableCard>

        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">

          {/* URL Slug */}
          <VerifiableCard
            icon={Link2}
            title="URL Slug"
            color="red"
            verified={verified.slug}
            onToggleVerified={() => toggleVerified('slug')}
          >
            <label className="text-xs font-semibold text-slate-700 block mb-2">URL Personalizada</label>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <span className="text-xs text-slate-600 font-medium">blog/</span>
              <input
                type="text"
                value={formData.seoSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="url-slug"
                className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 outline-none text-sm"
              />
            </div>
            <div className="flex items-start gap-2 text-green-700 text-xs bg-green-50 p-2 rounded">
              <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>Auto-sanitizado: minúsculas, sin acentos</span>
            </div>
          </VerifiableCard>

          {/* Enlaces Internos */}
          <VerifiableCard
            icon={Link2}
            title="Enlaces Internos"
            color="orange"
            verified={verified.links}
            onToggleVerified={() => toggleVerified('links')}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Enlace 1</label>
                <input
                  type="text"
                  value={formData.internalLink1}
                  onChange={(e) => onChange({ internalLink1: e.target.value })}
                  placeholder="/blog/otro-articulo"
                  className="w-full px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Enlace 2</label>
                <input
                  type="text"
                  value={formData.internalLink2}
                  onChange={(e) => onChange({ internalLink2: e.target.value })}
                  placeholder="/blog/otro-articulo"
                  className="w-full px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm transition"
                />
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-tight mt-2">
              Máx 2 enlaces • No diluyar autoridad
            </p>
          </VerifiableCard>

          {/* SEO Local */}
          <VerifiableCard
            icon={MapPin}
            title="SEO Local"
            color="blue"
            verified={verified.localSeo}
            onToggleVerified={() => toggleVerified('localSeo')}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-700">Activar SEO Local</label>
              <button
                onClick={() => handleLocalSEOToggle(!formData.isLocalSEO)}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition ${
                  formData.isLocalSEO ? 'bg-green-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    formData.isLocalSEO ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {showLocalSEOAnimation && formData.isLocalSEO && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Región *
                  </label>
                  <input
                    type="text"
                    value={formData.geoRegion}
                    onChange={(e) => onChange({ geoRegion: e.target.value })}
                    placeholder="Madrid, Cataluña..."
                    className={`w-full px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border transition text-sm ${
                      formData.isLocalSEO && !formData.geoRegion
                        ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                        : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    }`}
                  />
                  {formData.isLocalSEO && !formData.geoRegion && (
                    <p className="text-xs text-red-600 mt-1">Campo obligatorio</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={formData.geoCiudad}
                    onChange={(e) => onChange({ geoCiudad: e.target.value })}
                    placeholder="Madrid, Barcelona..."
                    className={`w-full px-3 py-2 rounded-lg bg-white text-slate-900 placeholder-slate-400 border transition text-sm ${
                      formData.isLocalSEO && !formData.geoCiudad
                        ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                        : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    }`}
                  />
                  {formData.isLocalSEO && !formData.geoCiudad && (
                    <p className="text-xs text-red-600 mt-1">Campo obligatorio</p>
                  )}
                </div>
              </div>
            )}

            {!formData.isLocalSEO && (
              <p className="text-xs text-slate-600 mt-2">
                Desactivado. Activa si tienes presencia local.
              </p>
            )}
          </VerifiableCard>

        </div>

      </div>

      {/* VALIDACIÓN FINAL - Abajo del todo */}
      {formData.isLocalSEO && !isLocalSEOValid && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3 mt-6">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <p className="font-bold mb-1">SEO Local incompleto</p>
            <p>Completa Región y Ciudad para continuar.</p>
          </div>
        </div>
      )}
    </StepContainer>
  );
}
