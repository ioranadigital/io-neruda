'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClients } from '@/src/hooks/useClients';
import { showToast } from '@/src/components/shared/Toast';
import ClientProfileForm from '@/src/components/forms/ClientProfileForm';
import { ArrowLeft, Plus } from 'lucide-react';
import { Client } from '@/src/types/client';

const EMPTY_CLIENT: Client = {
  id: `client_${Date.now()}`,
  name: '',
  slug: '',
  description: '',
  is_active: true,
  default_tone: 'professional',
  forbidden_keywords: [],
  competitor_urls: [],
  keywords_niche: [],
  keywords_longtail: [],
  channel_blog: false,
  channel_email: false,
  channel_linkedin: false,
  channel_instagram: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function NewClientPage() {
  const router = useRouter();
  const { createNewClient } = useClients();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (formData: any) => {
    try {
      setIsSaving(true);

      // Validate required fields
      if (!formData.name || !formData.slug) {
        showToast.error('❌ Nombre y slug son obligatorios');
        return;
      }

      await createNewClient(formData);
      showToast.success('✅ Cliente creado exitosamente');
      router.push('/clients');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creando cliente';
      showToast.error(`❌ ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen" style={{ background: '#f5f5f5' }}>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/clients"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} />
            Volver a clientes
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                Nuevo Cliente
              </h1>
              <p className="text-sm mt-2" style={{ color: '#727272' }}>
                Crea una nueva ficha de cliente con todos sus datos
              </p>
            </div>
            <button
              onClick={() => {
                const formElement = document.querySelector('form');
                if (formElement) {
                  formElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
              }}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition font-medium hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#6045E2' }}
            >
              <Plus size={20} />
              {isSaving ? 'Creando...' : 'Crear Cliente'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <ClientProfileForm
            client={EMPTY_CLIENT}
            onSubmit={handleSave}
            isLoading={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
