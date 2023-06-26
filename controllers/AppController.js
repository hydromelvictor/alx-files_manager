import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static async getStatus() {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.set('Content-Type', 'application/json');
      res.status(200).json({ "redis": true, "db": true }).end();
    }
  }

  static async getStats() {
    const users = await dbClient.nbUsers;
    const files = await dbClient.nbFiles;
    res.set('Content-Type', 'application/json');
    res.status(200).json({ users, files }).end();
  }
}

export default AppController;
