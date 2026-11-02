const express = require('express');
const path = require('path');
const app = express();

// Ruta principal que muestra la tarjeta visual kawaii
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de salud / monitoreo requerida por las pruebas y Docker compose
app.get('/health', (req, res) => {
    res.json({
        service: "devops-microservice",
        status: "online",
        environment: "production",
        version: "2.0.0"
    });
});

module.exports = app;