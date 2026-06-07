'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import { useClients } from '@/src/hooks/useClients';
import { showToast } from '../shared/Toast';
import { Save, X } from 'lucide-react';

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

type TabType = 'identity' | 'audience' | 'brand' | 'content' | 'competition' | 'channels' | 'references' | 'integration' | 'metrics' | 'management';

interface ClientProfileFormProps {
  client: Client;
}

const TABS: { key: TabType; label: string; icon: string }[] = [
  { key: 'identity', label: 'Identidad', icon: '🏢' },
  { key: 'audience', label: 'Audiencia', icon: '👥' },
  { key: 'brand', label: 'Marca', icon: '🎨' },
  { key: 'content', label: 'Contenido', icon: '📝' },
  { key: 'competition', label: 'Competencia', icon: '⚔️' },
  { key: 'channels', label: 'Canales', icon: '📢' },
  { key: 'references', label: 'Referencias', icon: '📚' },
  { key: 'integration', label: 'Integración', icon: '🔌' },
  { key: 'metrics', label: 'Métricas', icon: '📊' },
  { key: 'management', label: 'Gestión', icon: '⚙️' },
];

export default function ClientProfileForm({ client: initialClient }: ClientProfileFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [formData, setFormData] = useState<Partial<Client>>(initialClient);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { updateClientBrandMemory } = useClients();

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!initialClient.id) return;

    try {
      setIsSaving(true);
      await updateClientBrandMemory(initialClient.id, formData);
      setIsDirty(false);
      showToast.success('✅ Cliente guardado exitosamente');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error guardando cliente';
      showToast.error(`❌ ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialClient);
    setIsDirty(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-4 font-medium transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === tab.key
                  ? 'text-blue-600 border-blue-600 bg-white'
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        {activeTab === 'identity' && <TabIdentity formData={formData} onChange={handleChange} />}
        {activeTab === 'audience' && <TabAudience formData={formData} onChange={handleChange} />}
        {activeTab === 'brand' && <TabBrand formData={formData} onChange={handleChange} />}
        {activeTab === 'content' && <TabContent formData={formData} onChange={handleChange} />}
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium flex items-center gap-2"
          >
            <Save size={18} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      )}
    </div>
  );
}
