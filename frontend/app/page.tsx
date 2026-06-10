export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>IO Neruda</h1>
      <p>Redirigiendo...</p>
      <script>{`window.location.href = '/generators';`}</script>
    </div>
  );
}
