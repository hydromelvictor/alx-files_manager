const express = require('express');
const routes = express.Router();

routes.get('/status', AppController.getStatus);
routes.get('stats', AppController.getStats);
