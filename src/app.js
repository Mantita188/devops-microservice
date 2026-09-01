const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    service: 'devops-microservice',
    status: 'online',
    version: '1.0.0'
  });
});
module.exports = app;