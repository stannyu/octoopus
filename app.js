const EventEmitter = require('events');
const Logger = require('./logger');
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.write('Hello, Stas!');
    res.end();
  }
});

server.on('connection', (socket) => {
  console.log('Connected');
});
server.listen(3000);

console.log('listening for connection');

// const logger = new Logger();

// logger.on('myEvent', arg => {
//     console.log('FROM EVENT: ', arg);
// })

// logger.log();
