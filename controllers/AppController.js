const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static async getStatus() {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.set('Content-Type', 'application/json');
      res.status(200).json({ "redis": true, "db": true }).end();
    }
  }

  static async getStats() {
    const users = redisClient.nbUsers();
    const files = redisClient.nbFiles();
    res.set('Content-Type', 'application/json');
    res.status(200).json({ users, files }).end();
  }
}

export default AppController;
