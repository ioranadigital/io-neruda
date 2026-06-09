import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface GenerationRequestBody {
  prompt: string;
  systemPrompt: string;
  maxTokens?: number;
}

// Inicializar cliente de Anthropic con API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Array de modelos ordenados por preferencia (mejor modelo primero, fallback segundo)
const MODELOS_DISPONIBLES = [
  'claude-3-sonnet-active',      // Modelo principal (alias a última versión)
  'claude-sonnet-4-20250514',    // Fallback 1
  'claude-3-sonnet-20240229'     // Fallback 2
];

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequestBody = await request.json();

    // Validar campos requeridos
    if (!body.prompt || !body.systemPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, systemPrompt' },
        { status: 400 }
      );
    }

    // Validar API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[Crítico] ANTHROPIC_API_KEY no está configurada');
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 401 }
      );
    }

    // Sistema de fallback: intenta modelos en orden de preferencia
    let response: any = null;
    let ultimoError = '';
    let modeloUtilizado = '';

    for (const modelo of MODELOS_DISPONIBLES) {
      try {
        console.log(`\n[io-neruda] 🔄 Intentando generación con modelo: ${modelo}`);

        response = await anthropic.messages.create({
          model: modelo,
          max_tokens: body.maxTokens || 4000,
          system: body.systemPrompt,
          messages: [
            {
              role: 'user',
              content: body.prompt,
            },
          ],
        });

        if (response && response.content && response.content.length > 0) {
          modeloUtilizado = modelo;
          console.log(`\n✅ [io-neruda] Generación exitosa con el modelo: ${modelo}`);
          break; // Rompe el bucle si tuvo éxito
        }
      } catch (err: any) {
        // Captura detallada del error
        const errorStatus = err.status || err.code || 'UNKNOWN';
        const errorMessage = err.message || 'Error desconocido';
        const errorType = err.type || 'unknown_error';

        console.error(
          `\n⚠️ [Alerta API] El modelo '${modelo}' falló.` +
          `\n   📍 Código: ${errorStatus}` +
          `\n   📍 Tipo: ${errorType}` +
          `\n   📍 Motivo: ${errorMessage}`
        );

        ultimoError = errorMessage;

        // Si es el último modelo del array, lanza el error
        if (modelo === MODELOS_DISPONIBLES[MODELOS_DISPONIBLES.length - 1]) {
          console.error(
            `\n❌ [Crítico] Se agotaron todos los modelos disponibles.` +
            `\n   Último error: ${ultimoError}`
          );
        } else {
          console.log(`\n🔄 Conmutando al siguiente modelo de fallback...`);
        }
      }
    }

    // Si ningún modelo funcionó
    if (!response) {
      console.error('[Crítico Backend] No se pudo generar contenido con ningún modelo disponible');
      return NextResponse.json(
        {
          error: `No se pudo generar contenido. Última falla: ${ultimoError}. Verifica el estado de tu cuenta y créditos en https://console.anthropic.com/account/billing/overview`,
          lastError: ultimoError,
        },
        { status: 503 }
      );
    }

    // Extraer contenido de la respuesta
    const content = response.content[0]?.type === 'text' ? response.content[0].text : '';

    console.log(`\n📤 [io-neruda] Respuesta enviada al cliente (modelo: ${modeloUtilizado})`);

    return NextResponse.json({
      success: true,
      content,
      model: modeloUtilizado,
      usage: response.usage,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n[❌ Crítico Backend] Error no capturado: ${errorMessage}`);
    console.error(error);

    return NextResponse.json(
      {
        error: `Error crítico en el backend: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
