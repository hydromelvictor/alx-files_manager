import { createClient } from 'redis';

class RedisClient {
  constructor() {
    self.client = createClient();
    self.client.on('error', err => console.log(err));
  }

  isAlive() {
    return self.client.connected;
  }

  async get(key) {
    return await self.client.get(key);
  }

  async set(key, val, t) {
    setTimeout(async () => {
        await self.client.set(key, val, t);
    }, t)
  }

  async del(key) {
    await self.client.del(key);
  }
}
const redisClient = new RedisClient();
export default redisClient;
