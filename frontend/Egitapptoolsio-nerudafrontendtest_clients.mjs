import fetch from 'node-fetch';

const html = await fetch('http://localhost:3003/clients').then(r => r.text());
console.log('Page loads:', html.includes('Gestión de Clientes') || html.includes('ClientsPage'));
console.log('Has client data:', html.includes('Tech Innovations'));
console.log('Still loading spinner:', html.includes('animate-spin'));
