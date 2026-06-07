'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useGenerator } from '@/src/context/GeneratorContext';
import { useClients } from '@/src/hooks/useClients';
import { showToast } from '@/src/components/shared/Toast';
import ClientProfileForm from '@/src/components/forms/ClientProfileForm';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id as string;

  const { clients } = useGenerator();
  const { updateClientBrandMemory } = useClients();

  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (clients && clientId) {
      const foundClient = clients.find(c => c.id === clientId);
      if (foundClient) {
        setClient(foundClient);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showToast.error('❌ Cliente no encontrado');
      }
    }
  }, [clients, clientId]);

  const handleSave = async (formData: any) => {
    try {
      setIsSaving(true);
      await updateClientBrandMemory(clientId, formData);
      showToast.success('✅ Cliente actualizado exitosamente');
      router.push('/clients');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error actualizando cliente';
      showToast.error(`❌ ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: '#f5f5f5' }}>
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="w-full min-h-screen" style={{ background: '#f5f5f5' }}>
        <div className="px-6 py-6">
          <Link
            href="/clients"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft size={20} />
            Volver a clientes
          </Link>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <p className="text-gray-600 text-lg">Cliente no encontrado</p>
          </div>
        </div>
      </div>
    );
  }

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
                Editar Ficha de Cliente
              </h1>
              <p className="text-sm mt-2" style={{ color: '#727272' }}>
                {client.name}
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
              className="flex items-center gap-2 px-6 py-3 text-black rounded-lg transition font-medium hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#7BF1A8' }}
            >
              <Save size={20} />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <ClientProfileForm
            client={client}
            onSubmit={handleSave}
            isLoading={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
