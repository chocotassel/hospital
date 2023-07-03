// server.js
const https = require('https');
const fs = require('fs');
const path = require('path');
import app from './index';

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem')),
};

const server = https.createServer(options, app.callback());
server.listen(443);
console.log('Server is running on https://localhost:443');
