import Link from 'next/link';
import {
  Sparkles,
  FileText,
  Mail,
  Linkedin,
  Instagram,
  MessageCircle,
  FileBox,
  Target,
  SlidersHorizontal,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'IO Neruda — Generación de contenidos con IA',
  description:
    'Genera blog, email, redes sociales, WhatsApp y PDF a partir de tus keywords, con el tono de tu marca.',
};

const FORMATS = [
  { icon: FileText, name: 'Blog', desc: '1500–2000 palabras, optimizado SEO' },
  { icon: Mail, name: 'Email', desc: '250–350 palabras con variables' },
  { icon: Linkedin, name: 'LinkedIn', desc: '150–250 palabras con gancho' },
  { icon: Instagram, name: 'Instagram', desc: '100–150 caracteres con hashtags' },
  { icon: MessageCircle, name: 'WhatsApp', desc: '120–140 caracteres, tono cercano' },
  { icon: FileBox, name: 'PDF', desc: '2–3 páginas, formato profesional' },
];

const FEATURES = [
  {
    icon: Target,
    title: 'Keywords niche + longtail',
    desc: 'Parte de tu investigación de palabras clave para generar contenido alineado con lo que ya buscan tus clientes.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Tono de marca',
    desc: 'Profesional, cercano, técnico… cada pieza mantiene la voz de la marca para la que se genera.',
  },
  {
    icon: Layers,
    title: 'Multiformato en un solo paso',
    desc: 'Blog, email, redes y PDF a partir del mismo input, listos para revisar y publicar.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: '#f4fbf7' }}>
      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#4aa87a' }}
          >
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-900">IO Neruda</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#4aa87a' }}
        >
          Entrar
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Contenido para tu agencia,<br />generado con IA
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          A partir de tus keywords, IO Neruda genera blog, email, redes sociales, WhatsApp y
          PDF con el tono de cada marca — listo para revisar y publicar.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#4aa87a' }}
          >
            Entrar a la herramienta
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Sample output */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
            Ejemplo de salida — keyword: &quot;reformas de cocina en Madrid&quot;
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} style={{ color: '#4aa87a' }} />
                <span className="text-xs font-semibold text-slate-500">Blog</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Reformas de cocina en Madrid: guía 2026 para elegir sin sorpresas
              </p>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-3">
                Si estás valorando reformar tu cocina en Madrid, el primer paso es entender qué
                partidas del presupuesto pesan más y por qué…
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Instagram size={14} style={{ color: '#4aa87a' }} />
                <span className="text-xs font-semibold text-slate-500">Instagram</span>
              </div>
              <p className="text-sm text-slate-700">
                Tu cocina, renovada sin dolores de cabeza 🍳 Reformas en Madrid con presupuesto
                cerrado desde el día uno.
              </p>
              <p className="text-xs mt-1.5" style={{ color: '#4aa87a' }}>
                #ReformasMadrid #CocinasNuevas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
          Un input, todos los formatos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FORMATS.map(({ icon: Icon, name, desc }) => (
            <div
              key={name}
              className="bg-white rounded-xl border border-slate-200 p-4 text-center"
            >
              <Icon size={18} className="mx-auto mb-2" style={{ color: '#4aa87a' }} />
              <p className="text-sm font-semibold text-slate-800">{name}</p>
              <p className="text-[11px] text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: '#e8f5ee' }}
              >
                <Icon size={18} style={{ color: '#4aa87a' }} />
              </div>
              <p className="font-semibold text-slate-900">{title}</p>
              <p className="text-sm text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
        <span>IO Neruda · Herramienta interna de agencia</span>
        <Link href="/login" className="font-medium hover:underline" style={{ color: '#4aa87a' }}>
          Acceso al equipo
        </Link>
      </footer>
    </main>
  );
}
