'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import { useClients } from '@/src/hooks/useClients';
import { showToast } from '../shared/Toast';
import {
  Save, X, Building2, Users, Palette, BookOpen, Sword,
  Megaphone, Library, Zap, BarChart3, Settings
} from 'lucide-react';

// Sub-component imports (lazy loaded for performance)
import TabIdentity from './tabs/TabIdentity';
import TabAudience from './tabs/TabAudience';
import TabBrand from './tabs/TabBrand';
import TabContent from './tabs/TabContent';
import TabCompetition from './tabs/TabCompetition';
import TabChannels from './tabs/TabChannels';
import TabReferences from './tabs/TabReferences';
import TabIntegration from './tabs/TabIntegration';
import TabMetrics from './tabs/TabMetrics';
import TabManagement from './tabs/TabManagement';
import TabKeywords from './tabs/TabKeywords';

type TabType = 'identity' | 'audience' | 'brand' | 'content' | 'keywords' | 'competition' | 'channels' | 'references' | 'integration' | 'metrics' | 'management';

interface ClientProfileFormProps {
  client: Client | null;
  onSubmit?: (formData: Partial<Client>) => Promise<void>;
  isLoading?: boolean;
}

const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: 'identity', label: 'Identidad', icon: <Building2 size={18} /> },
  { key: 'audience', label: 'Audiencia', icon: <Users size={18} /> },
  { key: 'brand', label: 'Marca', icon: <Palette size={18} /> },
  { key: 'content', label: 'Contenido', icon: <BookOpen size={18} /> },
  { key: 'keywords', label: 'Keywords', icon: <BookOpen size={18} /> },
  { key: 'competition', label: 'Competencia', icon: <Sword size={18} /> },
  { key: 'channels', label: 'Canales', icon: <Megaphone size={18} /> },
  { key: 'references', label: 'Referencias', icon: <Library size={18} /> },
  { key: 'integration', label: 'Integración', icon: <Zap size={18} /> },
  { key: 'metrics', label: 'Métricas', icon: <BarChart3 size={18} /> },
  { key: 'management', label: 'Gestión', icon: <Settings size={18} /> },
];

export default function ClientProfileForm({ client: initialClient, onSubmit, isLoading: externalIsLoading }: ClientProfileFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [formData, setFormData] = useState<Partial<Client>>(initialClient || {
    name: '',
    slug: '',
    description: '',
    brand_name: '',
    long_description: '',
    business_type: '',
    website_url: '',
    country: '',
    phone: '',
    email: '',
    tagline: '',
    target_audience: '',
    avg_age: undefined,
    income_level: '',
    target_industries: [],
    problems_solved: [],
    unique_proposition: '',
    success_case: '',
    logo_url: '',
    color_primary: '#3B82F6',
    color_secondary: '#10B981',
    color_palette: [],
    typography: '',
    brand_voice: '',
    brand_story: '',
    brand_values: [],
    default_tone: 'professional',
    keywords_niche: [],
    keywords_longtail: [],
    keywords_producto: [],
    keywords_hierarchical: {},
    content_pillars: [],
    publication_frequency: '',
    supported_languages: ['es'],
    meta_description_template: '',
    avg_word_count: 1000,
    forbidden_keywords: [],
    competitor_urls: [],
    competitor_study_urls: [],
    successful_content_urls: [],
    competitive_advantages: [],
    differentiators: [],
    market_positioning: '',
    monitor_competitors: false,
    channel_blog: false,
    channel_email: false,
    channel_linkedin: false,
    channel_instagram: false,
    channel_twitter: false,
    channel_tiktok: false,
    channel_youtube: false,
    newsletter_enabled: false,
    newsletter_subscribers: 0,
    social_media_handles: {},
    preferred_formats: [],
    reference_sites: [],
    resources_urls: [],
    internal_docs_url: '',
    crm_platform: '',
    analytics_tool: '',
    email_platform: '',
    integrations: [],
    tech_stack: '',
    linkedin_connected: false,
    linkedin_profile_id: '',
    wordpress_connected: false,
    wordpress_url: '',
    wordpress_username: '',
    publishing_integrations: [],
    main_objective: '',
    main_kpi: '',
    conversion_goal: '',
    monthly_budget: 0,
    team_size: 0,
    project_timeline: '',
    internal_notes: '',
    client_status: 'active',
    start_date: new Date().toISOString(),
    next_review: new Date().toISOString(),
    primary_contact_name: '',
    primary_contact_email: '',
    account_manager_id: '',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    buyer_personas_list: [],
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(externalIsLoading || false);
  const { updateClientBrandMemory } = useClients();

  // Update local isSaving when external isLoading changes
  React.useEffect(() => {
    if (externalIsLoading !== undefined) {
      setIsSaving(externalIsLoading);
    }
  }, [externalIsLoading]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!initialClient || !initialClient.id) return;

    try {
      setIsSaving(true);
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await updateClientBrandMemory(initialClient.id, formData);
        setIsDirty(false);
        showToast.success('✅ Cliente guardado exitosamente');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error guardando cliente';
      showToast.error(`❌ ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (initialClient) {
      setFormData(initialClient);
    } else {
      setFormData(formData);
    }
    setIsDirty(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-full w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-3 text-sm font-medium transition flex items-center gap-1.5 whitespace-nowrap border-b-2 flex-shrink-0 ${
                activeTab === tab.key
                  ? 'text-black border-b-2'
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
              style={activeTab === tab.key ? { backgroundColor: '#7BF1A8', borderColor: '#7BF1A8', color: 'black' } : {}}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 2px;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>

      {/* Tab Content */}
      <div className="p-6 flex-1 overflow-auto">
        {activeTab === 'identity' && <TabIdentity formData={formData} onChange={handleChange} />}
        {activeTab === 'audience' && <TabAudience formData={formData} onChange={handleChange} />}
        {activeTab === 'brand' && <TabBrand formData={formData} onChange={handleChange} />}
        {activeTab === 'content' && <TabContent formData={formData} onChange={handleChange} />}
        {activeTab === 'keywords' && <TabKeywords formData={formData} onChange={handleChange} />}
        {activeTab === 'competition' && <TabCompetition formData={formData} onChange={handleChange} />}
        {activeTab === 'channels' && <TabChannels formData={formData} onChange={handleChange} />}
        {activeTab === 'references' && <TabReferences formData={formData} onChange={handleChange} />}
        {activeTab === 'integration' && <TabIntegration formData={formData} onChange={handleChange} />}
        {activeTab === 'metrics' && <TabMetrics formData={formData} onChange={handleChange} />}
        {activeTab === 'management' && <TabManagement formData={formData} onChange={handleChange} />}
      </div>

      {/* Footer Actions */}
      {isDirty && (
        <div className="border-t border-gray-200 bg-gray-50 p-6 flex gap-3 justify-end sticky bottom-0">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 font-medium"
          >
            <X size={18} className="inline mr-2" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 text-black rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium flex items-center gap-2"
            style={{ backgroundColor: '#7BF1A8' }}
          >
            <Save size={18} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      )}
    </div>
  );
}
