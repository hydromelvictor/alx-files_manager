const { mongoClient } = require('mongodb');
const MongoClient = require('mongodb/lib/mongo_client');
const process = require('process');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'file_manager';

const url = `mongodb://${host}:${port}/${database}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url);
    this.client.connect();
  }

  async isAlive() {
    return this.client.isConnected;
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }
}
const dbClient = new DBClient();
export default dbClient;
