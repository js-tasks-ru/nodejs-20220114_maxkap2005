const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.currentFileSize = 0;
    this.currentLimit = options.limit;
  }
  _transform(chunk, encoding, callback) {
    this.currentFileSize += chunk.length;

    if (this.currentLimit < this.currentFileSize){
      callback (new LimitExceededError ());
    }
    else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
