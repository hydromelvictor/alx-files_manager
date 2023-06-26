const express = require('express');
const routes = express.Router();

import AppController from '../controllers/AppController';

routes.get('/status', AppController.getStatus);
routes.get('stats', AppController.getStats);
routes.post('/users', UsersController.postNew);
