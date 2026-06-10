export default function NotFound() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
        Volver al inicio
      </a>
    </div>
  );
}
