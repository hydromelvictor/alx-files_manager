import dbClient  from "../utils/db";
const crypto = require('crypto');
import { v4 } from 'uuid';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    try {
      const header = req.header.Authorization;
      const auth = new Buffer.form(header.split(' ')[1], 'base64').toString().split(':');
      const email = auth[0];
      const password = crypto.createHash('sha1').update(auth[1]).digest('base64');
      const user = await dbClient.filterUser({email: email})
      if (user && user.password !== password) {
        res.status(401).json({"error":"Unauthorized"}).end();
      } else {
        const token = v4();
        await redisClient.set(`auth_${token}`, user.id.toString(), 86400);
        res.status(200).json({"token": token}).end();
      }
    } catch(err) {
      res.status(401).json({"error":"Unauthorized"}).end();
    }
    
  }

  static async getDisconnect(req, res) {
    const token = req;
    await redisClient.del(token);
    res.status(204).end();
  }
}

export default AuthController;
