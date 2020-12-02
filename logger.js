const EventEmitter = require('events');

class Logger extends EventEmitter {
  log() {
    this.emit('myEvent', { data: 'borodata' });
  }
}

module.exports = Logger;
