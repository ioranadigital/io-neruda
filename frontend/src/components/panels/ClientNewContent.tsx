'use client';

import { useRouter } from 'next/navigation';
import { useGenerator } from '@/src/context/GeneratorContext';
import ClientProfileForm from '../forms/ClientProfileForm';
import { ArrowLeft, Plus } from 'lucide-react';

export default function ClientNewContent() {
  const router = useRouter();
  const { addClient } = useGenerator();

  const handleSubmit = async (formData: any) => {
    try {
      console.log('📝 ClientNewContent.handleSubmit called');
      console.log('formData:', formData);
      addClient(formData);
      console.log('✅ addClient completed');
      await router.push('/clients');
      console.log('✅ router.push completed');
    } catch (err) {
      console.error('❌ Error creating client:', err);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-x-hidden">
      {/* Header con botón atrás */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 md:px-8 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-medium mb-4 text-sm"
          style={{ color: '#4aa87a' }}
        >
          <ArrowLeft size={20} />
          Volver a Clientes
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
            <Plus size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Crear Nuevo Cliente</h1>
            <p className="text-sm text-slate-600 mt-1">Completa la información del cliente</p>
          </div>
        </div>
      </div>

      {/* Ficha de nuevo cliente - scrolleable full-width */}
      <div className="flex-1 min-h-0 overflow-auto w-full">
        <div className="w-full p-6 md:p-8">
          <ClientProfileForm client={null} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
