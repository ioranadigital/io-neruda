import { GeneratedContent } from '../types/generator';

export function generateMockContent(
  clientName: string,
  configName: string,
  keywords: string[],
  format: string
): GeneratedContent {
  const formats: Record<string, string> = {
    blog: `# ${configName} - Blog Post

## Introducción
Descubre cómo ${keywords[0]} puede transformar tu negocio. En este artículo exploraremos las mejores prácticas y estrategias para maximizar tu presencia en línea.

## Ventajas Clave
- Mejora de visibilidad en buscadores
- Mayor engagement con tu audiencia
- Aumento de conversiones
- ROI comprobado

## Conclusión
La implementación de estas estrategias te permitirá alcanzar tus objetivos de marketing de manera efectiva.`,

    email: `Asunto: Descubre cómo ${keywords[0]} puede ayudarte

Hola,

¿Sabías que ${keywords[0]} es una de las tendencias más importantes en 2024?

Nuestros clientes han visto un aumento del 300% en su engagement implementando estas estrategias.

Te invitamos a conocer cómo podemos ayudarte.

¡Contáctanos hoy!

Saludos,
Equipo de ${clientName}`,

    social_linkedin: `🚀 ${configName}

¿Conoces los beneficios de ${keywords[0]}?

Hemos ayudado a cientos de empresas a transformar su estrategia digital.

📊 Resultados:
• +300% engagement
• +150% leads
• +75% conversiones

¿Te gustaría saber cómo?

#${keywords[0].replace(/\s/g, '')} #Marketing #Digital`,

    social_instagram: `✨ ${configName} ✨

Descubre el poder de ${keywords[0]} 🚀

Nuestros clientes no dejan de crecer. ¿Quieres ser el próximo?

Haz clic en el link de nuestro bio para más información 👆

#${keywords[0].replace(/\s/g, '')} #Marketing #Estrategia`,

    whatsapp: `¡Hola! 👋

Hemos creado una estrategia especial de ${configName} para tu negocio.

Con ${keywords[0]} logramos:
✅ Mayor visibilidad
✅ Más clientes
✅ Mejor ROI

¿Hablamos? 💬`,

    pdf: `DOCUMENTO: ${configName}
CLIENTE: ${clientName}
FECHA: ${new Date().toLocaleDateString()}

RESUMEN EJECUTIVO
================

Esta estrategia se enfoca en ${keywords[0]} para maximizar los resultados.

OBJETIVOS
- Aumentar visibilidad de marca
- Mejorar engagement
- Incrementar conversiones

METODOLOGÍA
${keywords.map((kw, i) => `${i + 1}. ${kw}`).join('\n')}

PRÓXIMOS PASOS
1. Análisis inicial
2. Implementación
3. Monitoreo y optimización
4. Reportes mensuales`,
  };

  return {
    content_id: `content_${Date.now()}`,
    client_id: clientName,
    config_id: configName,
    format: format as any,
    content: formats[format] || formats.blog,
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
