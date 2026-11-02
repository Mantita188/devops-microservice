
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Página principal visual
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Estado del microservicio en formato JSON
app.get('/api', (req, res) => {
  res.status(200).json({
    service: 'devops-microservice',
    status: 'online',
    version: '2.0.0'
  });
});

// Endpoint de salud para monitoreo y Docker
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    environment: 'production',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Productos iniciales
let products = [
  { id: 1, name: 'Servidor Cloud', price: 120 }
];

// Obtener productos
app.get('/products', (req, res) => {
  res.status(200).json(products);
});

// Registrar productos
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      error: 'Nombre y precio son requeridos'
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

module.exports = app;
