const express = require('express');
const routes = express.Router();

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/Auth.Controller';

routes.get('/status', AppController.getStatus);
routes.get('stats', AppController.getStats);
routes.post('/users', UsersController.postNew);
routes.get('conect', AuthController.getConnect);
routes.get('/disconnect', AuthController.getDisconnect);
routes.get('/users/me', UsersController.getMe);