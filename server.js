const express = require('express');
const process = require('process');

const port = process.env.PORT || 5000;
const routes = require('./routes/index');
const app = express();

app.use(express.json);
app.use(routes);
app.listen(port, '127.0.0.1');
export default app;
