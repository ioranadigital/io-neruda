'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MASTER_TEMPLATES } from '@/src/data/templates';
import { Template, TemplateInjection } from '@/src/types/templates';
import {
  Sparkles,
  ArrowRight,
  Scale3d,
  ShoppingCart,
  Wrench,
  MessageCircle,
  Brain,
  Eye,
  X,
  LayoutTemplate,
  Trophy,
  TrendingUp,
  BookMarked,
  Star,
  AlertTriangle,
  ChevronDown,
  MapPin,
  Ruler,
  Scroll,
  GitCompare,
} from 'lucide-react';

// Icon mapper
const ICON_MAP: Record<string, React.ReactNode> = {
  'Scale3d': <Scale3d size={32} />,
  'ShoppingCart': <ShoppingCart size={32} />,
  'Wrench': <Wrench size={32} />,
  'MessageCircle': <MessageCircle size={32} />,
  'Brain': <Brain size={32} />,
  'Trophy': <Trophy size={32} />,
  'TrendingUp': <TrendingUp size={32} />,
  'BookMarked': <BookMarked size={32} />,
  'Star': <Star size={32} />,
  'AlertTriangle': <AlertTriangle size={32} />,
  'MapPin': <MapPin size={32} />,
  'Ruler': <Ruler size={32} />,
  'Scroll': <Scroll size={32} />,
  'GitCompare': <GitCompare size={32} />,
};

// Example content for each template — rendered as JSX
const EJEMPLOS: Record<string, React.ReactNode> = {
  'tpl-comparative-premium': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Tabla de Surf Vintage vs Tabla Moderna: ¿Cuál Se Adapta a tu Estilo?
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Tabla Comparativa</p>
        <table className="w-full border-collapse text-xs rounded overflow-hidden">
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th className="p-2 text-left border" style={{ borderColor: '#e0e0e0' }}>Especificación</th>
              <th className="p-2 text-left border" style={{ borderColor: '#e0e0e0' }}>Vintage 70s</th>
              <th className="p-2 text-left border" style={{ borderColor: '#e0e0e0' }}>Moderna 2024</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Material', 'Poliuretano clásico', 'Epoxy ultraligero'],
              ['Longitud media', '9\'2"', '7\'6"'],
              ['Peso', '4.8 kg', '2.9 kg'],
              ['Precio aprox.', '380–520 €', '580–850 €'],
              ['Ideal para', 'Olas largas y suaves', 'Olas cortas y tubos'],
            ].map(([spec, a, b]) => (
              <tr key={spec}>
                <td className="p-2 border font-medium" style={{ borderColor: '#e0e0e0' }}>{spec}</td>
                <td className="p-2 border" style={{ borderColor: '#e0e0e0', color: '#555' }}>{a}</td>
                <td className="p-2 border" style={{ borderColor: '#e0e0e0', color: '#555' }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Análisis Producto A</p>
        <p className="font-semibold mb-1" style={{ color: '#333' }}>Tabla Vintage 70s</p>
        <p className="text-xs mb-2" style={{ color: '#666' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. La tabla vintage ofrece una experiencia de deslizamiento única, con un nose redondeado que facilita el trim clásico sobre olas de longitud media.</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded p-2" style={{ backgroundColor: '#f0faf0', border: '1px solid #c8e6c9' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#2e7d32' }}>✓ Pros</p>
            <ul className="text-xs space-y-1" style={{ color: '#444' }}>
              <li>• Estética y valor coleccionable</li>
              <li>• Flotabilidad superior en olas pequeñas</li>
              <li>• Precio de segunda mano accesible</li>
            </ul>
          </div>
          <div className="rounded p-2" style={{ backgroundColor: '#fff8f0', border: '1px solid #ffe0b2' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#e65100' }}>✗ Contras</p>
            <ul className="text-xs space-y-1" style={{ color: '#444' }}>
              <li>• Peso elevado para transporte</li>
              <li>• Maniobrabilidad limitada</li>
              <li>• Requiere mantenimiento de resina</li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Veredicto</p>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#f5f5f5', borderLeft: '3px solid #3b82f6' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#3b82f6' }}>Veredicto de la Agencia</p>
          <p className="text-xs" style={{ color: '#555' }}>Si buscas estilo y autenticidad con presupuesto ajustado, la vintage gana. Para máximo rendimiento técnico en competición, la moderna es la opción clara. Relación calidad-precio: <strong>Vintage para uso casual · Moderna para nivel avanzado</strong>.</p>
        </div>
      </div>
    </div>
  ),

  'tpl-shopping-guide': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Cómo Elegir el Robot Cortacésped Perfecto para tu Jardín en 2024
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — 3 Factores Críticos</p>
        <div className="space-y-3">
          {[
            { n: '01', title: 'Superficie y Pendiente del Terreno', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. La mayoría de robots domésticos cubren hasta 800 m². Si tu jardín supera esa cifra o tiene pendientes superiores al 35%, necesitarás un modelo de gama alta con tracción reforzada.' },
            { n: '02', title: 'Conectividad y App de Control', text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco. Los modelos con WiFi integrado permiten programar horarios, establecer zonas y recibir alertas de mantenimiento directamente en el móvil.' },
            { n: '03', title: 'Autonomía y Tiempo de Carga', text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. Una batería de 2.000 mAh ofrece entre 60 y 90 minutos de corte continuo. Para jardines grandes, prioriza modelos con retorno automático a la base.' },
          ].map(f => (
            <div key={f.n} className="flex gap-3">
              <span className="text-lg font-black shrink-0" style={{ color: '#10b981' }}>{f.n}</span>
              <div>
                <p className="font-semibold text-xs mb-1" style={{ color: '#333' }}>{f.title}</p>
                <p className="text-xs" style={{ color: '#666' }}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>Bloque destacado — Consejos de Uso</p>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#f0fdf8', border: '1px solid #a7f3d0' }}>
          <ul className="text-xs space-y-1.5" style={{ color: '#064e3b' }}>
            <li>💡 Instala el cable perimetral al menos 30 cm del bordillo para evitar colisiones.</li>
            <li>💡 Programa el corte en horario nocturno para no interferir con el uso del jardín.</li>
            <li>💡 Limpia las cuchillas cada 2–3 semanas para prolongar su vida útil.</li>
          </ul>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>Módulo de Conversión</p>
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#ecfdf5', border: '1px dashed #10b981' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>¿Listo para elegir el tuyo?</p>
          <p className="text-xs" style={{ color: '#555' }}>Explora nuestro catálogo completo con más de 40 modelos y filtra por superficie, precio y conectividad →</p>
        </div>
      </div>
    </div>
  ),

  'tpl-technical-tutorial': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Cómo Instalar un Sistema de Riego por Goteo en 7 Pasos (Sin Experiencia)
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Materiales Necesarios</p>
        <ul className="text-xs space-y-1.5" style={{ color: '#555' }}>
          {['Tubería de polietileno Ø16 mm (longitud según zona)', 'Goteros autocompensantes 2 L/h (1 por planta)', 'Programador de riego con batería', 'Filtro de malla 120 mesh', 'Conexiones en T y codos de 16 mm', 'Taladro manual y punzón de 4 mm'].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span style={{ color: '#8b5cf6' }}>▸</span>{item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Proceso Paso a Paso</p>
        <ol className="text-xs space-y-2" style={{ color: '#555' }}>
          {[
            'Mide y planifica el trazado de la tubería principal siguiendo el perímetro del área de cultivo.',
            'Conecta el programador al grifo e instala el filtro inmediatamente después para evitar obstrucciones.',
            'Tiende la tubería principal y fíjala al suelo con grapas cada 50 cm.',
            'Con el punzón, perfora la tubería en los puntos marcados e inserta cada gotero con un golpe firme.',
            'Conecta los ramales secundarios a la tubería principal usando las uniones en T.',
            'Prueba el sistema durante 5 minutos y ajusta la presión hasta que todos los goteros fluyan uniformemente.',
            'Programa el temporizador: 20 min/día en verano, 10 min/día en temporada media.',
          ].map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-black shrink-0" style={{ color: '#8b5cf6' }}>{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Errores Comunes a Evitar</p>
        <div className="space-y-2">
          {[
            { err: 'No instalar el filtro', fix: 'Sin filtro, los goteros se obstruyen en 2–3 semanas. Es el componente más importante.' },
            { err: 'Presión demasiado alta', fix: 'Por encima de 3 bar los goteros expulsan el agua en chorro. Usa un reductor de presión.' },
            { err: 'Goteros mal espaciados', fix: 'Cada planta necesita su propio gotero. Compartir uno entre dos plantas provoca riego desigual.' },
          ].map(e => (
            <div key={e.err} className="rounded p-2" style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color: '#c2410c' }}>⚠ {e.err}</p>
              <p className="text-xs" style={{ color: '#666' }}>{e.fix}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  'tpl-faq-conversion': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Preguntas Frecuentes sobre Compra y Devolución en Surfvintage
        </h1>
      </div>
      <div className="space-y-4">
        {[
          {
            q: '¿Qué pasa si la talla no me queda bien?',
            a: 'Tienes 30 días desde la recepción para realizar el cambio o devolución sin coste. Solo necesitas conservar las etiquetas originales. El proceso se gestiona íntegramente por email en menos de 24 h.',
            anchor: 'Garantía de talla sin coste durante 30 días.',
          },
          {
            q: '¿Cómo funciona la garantía de fábrica?',
            a: 'Todos los productos incluyen 2 años de garantía legal. Las tablas de surf cuentan además con 1 año adicional del fabricante ante defectos de laminado o delaminación del foam.',
            anchor: 'Hasta 3 años de cobertura combinada.',
          },
          {
            q: '¿Cuánto tarda el envío a toda España?',
            a: 'El plazo estándar es de 48–72 h laborables en Península. Baleares y Canarias: 4–5 días. Los pedidos realizados antes de las 14:00 h salen el mismo día.',
            anchor: 'Envío exprés disponible en checkout.',
          },
          {
            q: '¿Puedo pagar a plazos?',
            a: 'Sí. Ofrecemos financiación en 3, 6 y 12 cuotas sin intereses para pedidos superiores a 150 € a través de Sequra y Aplazame. Se selecciona directamente en el checkout.',
            anchor: 'Sin intereses. Sin papeleos. Aprobación inmediata.',
          },
        ].map(faq => (
          <div key={faq.q} className="rounded-lg p-3" style={{ border: '1px solid #fde68a', backgroundColor: '#fffbeb' }}>
            <p className="font-semibold text-xs mb-1" style={{ color: '#333' }}>❓ {faq.q}</p>
            <p className="text-xs mb-2" style={{ color: '#555' }}>{faq.a}</p>
            <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>→ {faq.anchor}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  'tpl-listicle-top-x': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Las 5 Mejores Tablas de Surf para Olas Largas en 2024 (Selección Editorial)
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Criterios de Selección (E-E-A-T)</p>
        <p className="text-xs" style={{ color: '#666' }}>Hemos analizado más de 40 modelos durante 6 meses de pruebas en agua. Nuestros criterios: flotabilidad para olas de 1–2 m, calidad de laminado, peso de transporte y relación rendimiento/precio. Solo entran los que aprueban los 4.</p>
      </div>
      {[
        { n: '#1', name: 'Longboard Noserider Classic 9\'2"', user: 'Surfista recreational que busca deslizamiento clásico', cta: 'Ver en tienda →' },
        { n: '#2', name: 'Malibu Evolution 8\'6" Epoxy', user: 'Progresión intermedia, ideal para olas suaves de playa', cta: 'Consultar stock →' },
        { n: '#3', name: 'Fun Shape Retro Twin 7\'4"', user: 'Surfista versátil que alterna olas pequeñas y medianas', cta: 'Añadir al carrito →' },
      ].map(item => (
        <div key={item.n} className="rounded-lg p-4 space-y-2" style={{ border: '1px solid #e0e8ff', backgroundColor: '#f8f9ff' }}>
          <p className="font-bold text-xs" style={{ color: '#6366f1' }}>{item.n} — {item.name}</p>
          <ul className="text-xs space-y-1" style={{ color: '#555' }}>
            <li>✓ Flotabilidad superior para olas de baja potencia</li>
            <li>✓ Construcción epoxy ultraligera (2.8 kg)</li>
            <li>✓ Diseño retro con rendimiento moderno</li>
          </ul>
          <p className="text-xs" style={{ color: '#888' }}><strong>Perfil ideal:</strong> {item.user}</p>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#6366f120', color: '#6366f1' }}>{item.cta}</span>
        </div>
      ))}
    </div>
  ),

  'tpl-newsjacking-tendencias': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          La Estética Coastal Grandmother Arrasa en 2024: Cómo Llevarla a tu Jardín
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>Párrafo gancho</p>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#f0fdff', border: '1px solid #a5f3fc' }}>
          <p className="text-xs" style={{ color: '#0e7490' }}>La tendencia <strong>Coastal Grandmother</strong> ha acumulado más de 340 millones de visualizaciones en TikTok este verano. Su estética — materiales naturales, tonos arena y textiles de lino — ha saltado del armario al jardín. Y los datos de búsqueda lo confirman: &quot;decoración jardín estilo mediterráneo&quot; creció un 280% en los últimos 60 días.</p>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Impacto en el Sector</p>
        <p className="text-xs" style={{ color: '#555' }}>Lorem ipsum dolor sit amet. El movimiento ha empujado la demanda de materiales porosos (piedra natural, cerámica artesanal, madera sin tratar) y ha deprecado las superficies plásticas brillantes. Los fabricantes europeos registran un incremento del 45% en pedidos de macetas de terracota entre mayo y agosto.</p>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — 3 Productos de Nuestra Tienda que Encajan</p>
        <div className="space-y-2">
          {['Macetero Terracota Toscana Ø35 cm', 'Hamaca de Algodón Natural Trenzado', 'Farolillo Solar Estilo Mediterráneo'].map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded p-2" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <span className="text-xs font-black" style={{ color: '#06b6d4' }}>0{i + 1}</span>
              <span className="text-xs font-medium" style={{ color: '#333' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  'tpl-glosario-eeat': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Qué es el Epoxy en Tablas de Surf: Definición, Ventajas y Diferencias con el Poliuretano
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Definición (Featured Snippet)</p>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#faf5ff', border: '1px solid #d8b4fe' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#7c3aed' }}>Definición directa</p>
          <p className="text-xs" style={{ color: '#555' }}>El <strong>epoxy</strong> en tablas de surf es una resina sintética termoestable que se usa como material de laminación sobre un núcleo de EPS (poliestireno expandido). Resulta entre un 30 y un 40% más ligero que el poliuretano tradicional y ofrece mayor resistencia a los golpes.</p>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Funcionamiento Técnico</p>
        <p className="text-xs" style={{ color: '#555' }}>La resina epoxy se cataliza con un endurecedor en proporción 2:1. Al curar, forma una red molecular cerrada que impermeabiliza el núcleo y distribuye el impacto de forma homogénea. Su punto de fusión supera los 120 °C, lo que la hace incompatible con reparaciones de poliéster estándar.</p>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Materiales Asociados</p>
        <ul className="text-xs space-y-1.5" style={{ color: '#555' }}>
          {['Núcleo EPS (densidad 30–40 kg/m³)', 'Fibra de vidrio 4oz S-glass', 'Resina epoxy de bajo VOC (sistema marino)', 'Acabado leash plug compatible'].map(m => (
            <li key={m} className="flex items-center gap-2"><span style={{ color: '#7c3aed' }}>▸</span>{m}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>Bloque de enlazado interno</p>
        <div className="rounded p-2 space-y-1" style={{ backgroundColor: '#f5f3ff', border: '1px solid #ede9fe' }}>
          {['→ Ver tablas de surf epoxy', '→ Accesorios de reparación epoxy', '→ Guía: PU vs EPS ¿cuál elegir?'].map(l => (
            <p key={l} className="text-xs font-medium" style={{ color: '#7c3aed' }}>{l}</p>
          ))}
        </div>
      </div>
    </div>
  ),

  'tpl-caso-estudio-antes-despues': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Cómo Transformamos un Jardín Abandonado de 80 m² en un Espacio de Ocio Funcional
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Situación Inicial y Dolores del Cliente</p>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecaca' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#dc2626' }}>Estado ANTES</p>
          <p className="text-xs" style={{ color: '#555' }}>El cliente nos contactó en marzo con un jardín de 80 m² completamente descuidado: césped muerto, tres árboles con poda atrasada de 4 años y un sistema de riego por aspersión roto que generaba charcos. El objetivo era crear una zona de barbacoa y un área de juegos para los niños antes del verano.</p>
          <ul className="text-xs mt-2 space-y-1" style={{ color: '#888' }}>
            <li>• Presupuesto disponible: 2.800 €</li>
            <li>• Plazo: 3 semanas antes de temporada</li>
            <li>• Problema principal: suelo compacto con problemas de drenaje</li>
          </ul>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Proceso Paso a Paso</p>
        <ol className="text-xs space-y-2" style={{ color: '#555' }}>
          {[
            'Escarificado del suelo + aireación con pincho hueco (alquiler de maquinaria Esgarden Pro)',
            'Instalación sistema de riego por goteo con programador Orbit 6 estaciones',
            'Semillado con mezcla resistente a sequía (80% festuca, 20% ray-grass)',
            'Montaje zona barbacoa con losas de pizarra 40×40 y gravilla de cuarzo blanco',
            'Instalación valla de bambú tratado para delimitar zona infantil',
          ].map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-black shrink-0" style={{ color: '#ef4444' }}>{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Resultado Final</p>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#16a34a' }}>Estado DESPUÉS</p>
          <p className="text-xs mb-2" style={{ color: '#555' }}>Jardín completamente recuperado en 18 días. El cliente valoró especialmente el sistema de riego automático que redujo su consumo de agua un 35%. La zona de barbacoa es ahora el espacio familiar principal durante los fines de semana de verano.</p>
          <div className="space-y-1">
            {['→ Programador riego Orbit 6 estaciones', '→ Losas pizarra 40×40 (pack 10 uds)', '→ Semilla césped resistente sequía 1 kg'].map(l => (
              <p key={l} className="text-xs font-medium" style={{ color: '#ef4444' }}>{l}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),

  'tpl-faq-semantic-density': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Guía GEO: Preguntas Frecuentes sobre Piscinas Portátiles (Optimizado para IA)
        </h1>
      </div>
      <div className="space-y-4">
        {[
          {
            q: '¿Por qué mi piscina portátil pierde presión en los primeros días?',
            a: 'Las pérdidas de presión en las primeras 48–72 h son normales en estructuras de PVC. El material se estira un 3–5% al llenarse por primera vez. Si la pérdida supera el 10% en 24 h, revisa: (1) juntas de válvula, (2) soldaduras laterales, (3) tapón de desagüe. El 80% de los casos se resuelven apretando el tapón de desagüe un cuarto de vuelta.',
          },
          {
            q: '¿Cómo se calcula la cantidad de cloro necesaria para una piscina de 5.000 L?',
            a: 'Para mantenimiento diario: 5 g de cloro granulado por cada 1.000 L. Una piscina de 5.000 L requiere 25 g/día en verano. Ajusta a 15 g/día en temporada media. El pH objetivo es 7.2–7.6; por fuera de ese rango el cloro pierde hasta un 60% de eficacia.',
          },
          {
            q: '¿Cuánto tiempo tarda en calentarse una piscina portátil con calentador solar?',
            a: 'Un calentador solar de 6 m² eleva la temperatura del agua 4–6 °C por día de exposición solar directa (mínimo 6 h). Partiendo de 18 °C (temperatura media del grifo), alcanzarás los 26–28 °C en 2–3 días en julio–agosto en la zona mediterránea.',
          },
          {
            q: '¿Qué superficie mínima de terreno necesito para instalar una piscina portátil de 4 x 2 m?',
            a: 'La normativa general recomienda 1 m de holgura perimetral de seguridad, por lo que necesitas un espacio de al menos 6 x 4 m (24 m²). El terreno debe ser completamente llano (tolerancia máxima: 2 cm de desnivel) y estar libre de objetos punzantes.',
          },
          {
            q: '¿Puedo dejar una piscina portátil montada todo el invierno?',
            a: 'No es recomendable en zonas con heladas (temperaturas bajo 0 °C). El PVC se vuelve rígido y puede agrietarse. El protocolo de invernada correcto: (1) vaciar completamente, (2) limpiar con paño suave, (3) doblar sin dobleces forzados, (4) almacenar a temperatura >5 °C. Esto prolonga la vida útil de 3–5 a 8–10 temporadas.',
          },
        ].map(faq => (
          <div key={faq.q} className="rounded-lg p-3" style={{ border: '1px solid #f9a8d4', backgroundColor: '#fdf2f8' }}>
            <p className="font-semibold text-xs mb-1.5" style={{ color: '#be185d' }}>❓ {faq.q}</p>
            <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  'tpl-local-geo-hub': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Piscinas Portátiles en Asturias: Guía de Idoneidad Climática y Entrega en 48 h
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Comportamiento bajo clima atlántico</p>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#f0fdff', border: '1px solid #a5f3fc' }}>
          <p className="text-xs" style={{ color: '#0e7490' }}>
            El clima del Cantábrico combina humedad relativa superior al 75%, lluvias frecuentes entre octubre y mayo y temperaturas que raramente superan los 28 °C en verano. Para una piscina portátil, esto implica: <strong>(1)</strong> el PVC debe tener tratamiento anti-UV mínimo UPF 30 para aguantar la radiación difusa, <strong>(2)</strong> los accesorios metálicos deben ser de acero inox 304 o aluminio anodizado para resistir el salitre del ambiente costero, <strong>(3)</strong> la temporada de uso efectivo se reduce a 10–12 semanas (junio–agosto).
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Entrega y asistencia técnica en la zona</p>
        <div className="space-y-2">
          {[
            { zona: 'Asturias Central (Oviedo, Gijón, Avilés)', plazo: '24–48 h laborables', nota: 'Entrega en planta baja o finca' },
            { zona: 'Costa Cantábrica (Santander, Castro-Urdiales)', plazo: '48–72 h laborables', nota: 'Zonas rurales +1 día' },
            { zona: 'Galicia (A Coruña, Vigo, Santiago)', plazo: '48–72 h laborables', nota: 'Instalación asistida disponible' },
          ].map(z => (
            <div key={z.zona} className="flex justify-between items-center text-xs rounded p-2" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <span style={{ color: '#333' }}>{z.zona}</span>
              <span className="font-semibold" style={{ color: '#0891b2' }}>{z.plazo}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>Consejos de preservación en entorno húmedo</p>
        <ul className="text-xs space-y-1.5" style={{ color: '#555' }}>
          {[
            'Seca completamente la lona antes de doblarla — la humedad residual genera hongos en 48 h.',
            'Aplica protector de PVC en spray cada 2 temporadas para mantener la flexibilidad.',
            'Almacena a temperatura >8 °C; el PVC se vuelve quebradizo bajo 5 °C.',
          ].map(c => <li key={c} className="flex gap-2"><span style={{ color: '#0891b2' }}>▸</span>{c}</li>)}
        </ul>
      </div>
    </div>
  ),

  'tpl-selector-medidas': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Cómo Elegir la Talla Exacta de tu Traje de Surf Vintage: Guía de Medidas Sin Devoluciones
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Cómo tomar tus medidas (paso a paso)</p>
        <ol className="text-xs space-y-2" style={{ color: '#555' }}>
          {[
            'Pecho: mide en la parte más ancha del torso, cinta paralela al suelo. Anota en cm.',
            'Cintura: mide 2 cm por encima del ombligo. No comprimas la cinta.',
            'Cadera: punto más ancho, generalmente 20 cm bajo la cintura.',
            'Talla de pantalón vintage: (cintura en cm ÷ 2.54) = pulgadas. Redondea al par más cercano.',
          ].map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-black shrink-0" style={{ color: '#d97706' }}>{i + 1}.</span><span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Matriz de equivalencias de inventario</p>
        <table className="w-full border-collapse text-xs rounded overflow-hidden">
          <thead>
            <tr style={{ backgroundColor: '#fffbeb' }}>
              {['Medida pecho', 'Talla EU', 'Equiv. Vintage US', 'Stock'].map(h => (
                <th key={h} className="p-2 text-left border font-semibold" style={{ borderColor: '#fde68a', color: '#92400e' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['86–90 cm', 'S', '34–36"', '✓ Disponible'],
              ['91–96 cm', 'M', '38–40"', '✓ Disponible'],
              ['97–102 cm', 'L', '42–44"', '⚡ Últimas 2'],
              ['103–108 cm', 'XL', '46–48"', '✓ Disponible'],
            ].map(([med, eu, us, stock]) => (
              <tr key={eu}>
                <td className="p-2 border text-xs" style={{ borderColor: '#fde68a' }}>{med}</td>
                <td className="p-2 border text-xs font-semibold" style={{ borderColor: '#fde68a', color: '#333' }}>{eu}</td>
                <td className="p-2 border text-xs" style={{ borderColor: '#fde68a', color: '#666' }}>{us}</td>
                <td className="p-2 border text-xs font-semibold" style={{ borderColor: '#fde68a', color: stock.includes('⚡') ? '#d97706' : '#16a34a' }}>{stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-lg p-3" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#d97706' }}>H3 — Garantía de Ajuste Perfecto</p>
        <p className="text-xs" style={{ color: '#555' }}>Si tras seguir esta guía el producto no te queda bien, cubrimos el cambio de talla sin coste adicional durante 30 días. Solo necesitas el ticket de compra y las etiquetas originales intactas.</p>
      </div>
    </div>
  ),

  'tpl-manifiesto-origen': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          La Historia Real de las Tablas Hobie: Patentes, Materiales y Por Qué Siguen Siendo Insuperables
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Contexto histórico y patentes originales</p>
        <p className="text-xs" style={{ color: '#555' }}>
          Hobie Alter registró su primer proceso de moldeo en poliuretano expandido en 1958 (US Patent 2,929,113). La innovación no era solo el material — era la geometría del rocker (curvatura longitudinal) calculada manualmente con plantillas de madera. Entre 1958 y 1972, la fábrica de Dana Point produjo más de 140.000 unidades, cada una con número de serie grabado a mano en la parte inferior del nose.
        </p>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Proceso de verificación y restauración</p>
        <div className="space-y-2">
          {[
            { paso: 'Autenticación del número de serie', detalle: 'Cotejo con base de datos Hobie Heritage Foundation (1956–1975).' },
            { paso: 'Test de densidad del foam', detalle: 'Muestra de 5 g extraída con caña de biopsia — densidad original: 32 kg/m³ ±2.' },
            { paso: 'Análisis de resina', detalle: 'Espectroscopia FTIR confirma poliéster ortoftálico de época vs. epoxy moderno.' },
            { paso: 'Certificado de autenticidad', detalle: 'Emitido con fotografía detallada del deck, rail y leash plug original.' },
          ].map(p => (
            <div key={p.paso} className="rounded p-2" style={{ backgroundColor: '#faf5ff', border: '1px solid #ede9fe' }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color: '#7e22ce' }}>✓ {p.paso}</p>
              <p className="text-xs" style={{ color: '#666' }}>{p.detalle}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg p-3" style={{ backgroundColor: '#faf5ff', border: '1px solid #d8b4fe' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#7e22ce' }}>Valor de Inversión a Largo Plazo</p>
        <p className="text-xs" style={{ color: '#555' }}>Las Hobie originales de los 60s han revalorizado un 340% entre 2010 y 2024 según registros de subastas Sotheby&apos;s y eBay Vintage Surf. Una tabla en estado de colección adquirida hoy por 680 € podría alcanzar los 1.500–2.200 € en una década.</p>
      </div>
    </div>
  ),

  'tpl-alternativas-inteligentes': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Alternativas al Dyson V15: 3 Opciones que Igualan su Potencia por la Mitad de Precio
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — ¿Qué hace tan deseable al producto de referencia?</p>
        <p className="text-xs" style={{ color: '#555' }}>
          El Dyson V15 Detect domina las búsquedas por tres razones concretas: sensor láser que detecta partículas invisibles, motor digital de 240 AW y autonomía de 60 minutos en modo Eco. Su precio de 649–749 € lo convierte en el aspirador inalámbrico más buscado pero menos comprado de 2024. El 68% de los visitantes que buscan &quot;Dyson V15&quot; acaban comprando una alternativa según datos de heatmaps de tiendas comparadoras.
        </p>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Las 3 alternativas de nuestro catálogo</p>
        <table className="w-full border-collapse text-xs rounded overflow-hidden">
          <thead>
            <tr style={{ backgroundColor: '#eff6ff' }}>
              {['Modelo', 'Potencia', 'Autonomía', 'Precio', 'Vs Dyson'].map(h => (
                <th key={h} className="p-2 text-left border font-semibold" style={{ borderColor: '#bfdbfe', color: '#1e40af' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Rowenta X-Force 14.60', '220 AW', '55 min', '349 €', '-300 € / 91%'],
              ['Shark IZ300EU', '200 AW', '60 min', '299 €', '-350 € / 83%'],
              ['Tineco Pure One S15', '185 AW', '40 min', '249 €', '-400 € / 77%'],
            ].map(([m, p, a, pr, vs]) => (
              <tr key={m}>
                <td className="p-2 border text-xs font-medium" style={{ borderColor: '#bfdbfe', color: '#333' }}>{m}</td>
                <td className="p-2 border text-xs" style={{ borderColor: '#bfdbfe', color: '#555' }}>{p}</td>
                <td className="p-2 border text-xs" style={{ borderColor: '#bfdbfe', color: '#555' }}>{a}</td>
                <td className="p-2 border text-xs font-semibold" style={{ borderColor: '#bfdbfe', color: '#2563eb' }}>{pr}</td>
                <td className="p-2 border text-xs font-semibold" style={{ borderColor: '#bfdbfe', color: '#16a34a' }}>{vs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),

  'tpl-troubleshooting': (
    <div className="space-y-5 text-sm" style={{ color: '#444444' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#aaaaaa' }}>H1</p>
        <h1 className="text-xl font-bold" style={{ color: '#222222' }}>
          Mi Cortacésped No Arranca: Causas, Diagnóstico y Reparación Paso a Paso
        </h1>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Diagnóstico del Síntoma</p>
        <div className="rounded-lg p-3" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <p className="text-xs" style={{ color: '#0369a1' }}>Si tu cortacésped no arranca al tirar del cordón o al pulsar el botón de encendido, el problema suele estar en uno de estos 4 sistemas: <strong>carburador obstruido, bujía desgastada, filtro de aire colmatado o cable de parada desconectado</strong>. El 70% de los casos se resuelve sin herramientas especializadas en menos de 30 minutos.</p>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>Tabla Causa → Efecto</p>
        <table className="w-full border-collapse text-xs rounded overflow-hidden">
          <thead>
            <tr style={{ backgroundColor: '#f0f9ff' }}>
              <th className="p-2 text-left border" style={{ borderColor: '#e0e0e0', color: '#0369a1' }}>Síntoma</th>
              <th className="p-2 text-left border" style={{ borderColor: '#e0e0e0', color: '#0369a1' }}>Causa probable</th>
              <th className="p-2 text-left border" style={{ borderColor: '#e0e0e0', color: '#0369a1' }}>Dificultad</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['No arranca en frío', 'Carburador con barniz de combustible viejo', 'Media'],
              ['Arranca y se para', 'Filtro de aire obstruido', 'Fácil'],
              ['Chispa pero no explota', 'Bujía desgastada o con gap incorrecto', 'Fácil'],
              ['Cordón no tiene resistencia', 'Cable de parada activado involuntariamente', 'Muy fácil'],
            ].map(([s, c, d]) => (
              <tr key={s}>
                <td className="p-2 border text-xs" style={{ borderColor: '#e0e0e0', color: '#444' }}>{s}</td>
                <td className="p-2 border text-xs" style={{ borderColor: '#e0e0e0', color: '#555' }}>{c}</td>
                <td className="p-2 border text-xs font-semibold" style={{ borderColor: '#e0e0e0', color: '#0ea5e9' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>H2 — Reparación del Carburador (Caso más Frecuente)</p>
        <ol className="text-xs space-y-2" style={{ color: '#555' }}>
          {[
            'Desconecta el cable de la bujía para evitar arranques accidentales.',
            'Localiza el carburador (pieza metálica con 1–2 tornillos en el lateral del motor).',
            'Extrae el filtro de combustible del depósito con un gancho de alambre.',
            'Sumerge el carburador en limpiador específico durante 15 minutos.',
            'Sopla los conductos con aire comprimido y reinstala.',
          ].map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-black shrink-0" style={{ color: '#0ea5e9' }}>{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#aaaaaa' }}>Recambios y Alternativas</p>
        <div className="space-y-1">
          {['→ Kit carburador universal para motores de 4T', '→ Bujía Champion RJ19LM (compatible 80% gasolina)', '→ Filtro de aire esponja universal 28×52 mm'].map(l => (
            <p key={l} className="text-xs font-medium" style={{ color: '#0ea5e9' }}>{l}</p>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ─────────────────────────────────────────────
// Modal component
// ─────────────────────────────────────────────
interface ExampleModalProps {
  template: Template;
  onClose: () => void;
}

function ExampleModal({ template, onClose }: ExampleModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-xl shrink-0"
          style={{
            backgroundColor: template.colorBadge + '12',
            borderBottom: `1px solid ${template.colorBadge}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <div style={{ color: template.colorBadge }}>
              {ICON_MAP[template.icon]}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: template.colorBadge }}>
                Ejemplo de estructura
              </p>
              <h3 className="text-sm font-bold" style={{ color: '#333333' }}>
                {template.nombre}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition hover:bg-black/5"
            style={{ color: '#999' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {EJEMPLOS[template.id] ?? (
            <p className="text-sm" style={{ color: '#999' }}>No hay ejemplo disponible para esta plantilla.</p>
          )}
        </div>

        {/* Modal footer */}
        <div
          className="px-6 py-4 flex justify-end gap-3 shrink-0"
          style={{ borderTop: '1px solid #f0f0f0' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg transition"
            style={{ color: '#777', backgroundColor: '#f5f5f5' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function TemplatesListView() {
  const router = useRouter();
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) =>
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleUseTemplate = (template: Template) => {
    const injectionPayload: TemplateInjection = {
      tipoPropuesta: template.targetPropuesta,
      subcategoriaPropuesta: template.subcategoria,
      promptEstructuraFijada: template.structurePrompt,
    };
    sessionStorage.setItem('template-injection', JSON.stringify(injectionPayload));
    sessionStorage.setItem('template-source', 'true');
    router.push('/generators?step=0');
  };

  return (
    <>
      {previewTemplate && (
        <ExampleModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
      )}

      <div className="w-full space-y-6">
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 -mx-8 -mt-8 px-8 py-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                <LayoutTemplate size={22} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Plantillas</h1>
                <p className="text-sm text-slate-600 mt-1">Repositorio de moldes de contenido optimizados. Selecciona uno y redacta directamente.</p>
              </div>
            </div>
          </div>
        </div>

        {/* TEMPLATES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MASTER_TEMPLATES.map((template) => {
            const expanded = expandedIds.has(template.id);
            return (
              <div
                key={template.id}
                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                style={{ borderColor: '#e0e0e0' }}
              >
                {/* Card Header — siempre visible, clic para expandir */}
                <button
                  onClick={() => toggleExpand(template.id)}
                  className="w-full text-left px-5 py-4 transition-colors"
                  style={{ backgroundColor: template.colorBadge + '12' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div style={{ color: template.colorBadge }}>
                      {ICON_MAP[template.icon]}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: template.colorBadge + '20', color: template.colorBadge }}
                      >
                        {template.categoria}
                      </span>
                      <ChevronDown
                        size={16}
                        style={{
                          color: template.colorBadge,
                          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  </div>
                  <h2 className="text-sm font-bold text-left" style={{ color: '#333333' }}>{template.nombre}</h2>
                  <p className="text-xs mt-2 text-left" style={{ color: '#666666', lineHeight: '1.5' }}>
                    {template.descripcion}
                  </p>
                </button>

                {/* Contenido expandible */}
                {expanded && (
                  <>
                    <div className="px-5 py-4 space-y-4 flex-1" style={{ borderTop: `1px solid ${template.colorBadge}20` }}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#999999' }}>Tipo de Propuesta</p>
                          <p className="text-xs font-medium" style={{ color: '#444444' }}>
                            {template.targetPropuesta.charAt(0).toUpperCase() + template.targetPropuesta.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#999999' }}>Subcategoría</p>
                          <p className="text-xs font-medium" style={{ color: '#444444' }}>{template.subcategoria}</p>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3" style={{ backgroundColor: '#f9f9f9', borderColor: '#ebebeb' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#999999' }}>Estructura Fija</p>
                        <p className="text-xs" style={{ color: '#aaaaaa', lineHeight: '1.6' }}>
                          {template.structurePrompt.substring(0, 120)}…
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 py-3 border-t flex gap-2" style={{ borderColor: '#f0f0f0' }}>
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all text-xs font-medium"
                        style={{ backgroundColor: '#f5f5f5', color: '#666666', border: '1px solid #e8e8e8', flexShrink: 0 }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#eeeeee'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f5f5'; }}
                      >
                        <Eye size={13} />
                        Ver ejemplo
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 font-semibold rounded-lg transition-all text-xs"
                        style={{ backgroundColor: template.colorBadge + '15', color: template.colorBadge, border: `1px solid ${template.colorBadge}40` }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = template.colorBadge + '28'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = template.colorBadge + '15'; }}
                      >
                        <Sparkles size={13} />
                        Usar este Molde
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* INFO SECTION */}
        <div
          className="border rounded-lg p-4"
          style={{ backgroundColor: '#f8fffe', borderColor: '#b2e8ea' }}
        >
          <p className="text-xs" style={{ color: '#4a9fa3' }}>
            <strong>Cómo funciona:</strong> Al hacer clic en &quot;Usar este Molde&quot;, la plantilla se inyectará
            automáticamente en el generador. Selecciona un cliente y continúa con el flujo normal de redacción.
          </p>
        </div>

        {/* TEMPLATES COUNT */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#999999' }}>
            Total de plantillas disponibles:{' '}
            <span style={{ color: '#18bdc1', fontWeight: 'bold' }}>14 moldes maestros</span>
          </p>
        </div>
      </div>
    </>
  );
}
