import dbClient from "../utils/db";
const crypto = require('crypto');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({"error": "Missing email"}).end();
    }
    if (!password) {
      res.status(400).json({"error": "Missing password"}).end();
    }
    if (dbClient.userExists(email)) {
      res.status(400).json({"error": "Already exist"}).end();
    }
    const user = {
      "password": crypto.createHash('sha1').update(password).digest(),
      "email": email
    }
    user = dbClient.client.db().collection("users").insertOne(user);
    res.status(201).json({"eamil": user.email, "id": user.id}).end();
  }
}