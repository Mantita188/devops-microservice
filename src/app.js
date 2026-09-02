const express = require('express');
const app = express();

app.use(express.json());

let products = [
  { id: 1, name: 'Servidor Cloud', price: 120 }
];

app.get('/', (req, res) => {
  res.status(200).json({
    service: 'devops-microservice',
    status: 'online',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    environment: 'production',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/products', (req, res) => {
  res.status(200).json(products);
});

app.post('/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
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