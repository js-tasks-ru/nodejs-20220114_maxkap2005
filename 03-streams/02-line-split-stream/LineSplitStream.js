const stream = require('stream');
const os = require('os');


class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.delimeter = os.EOL;
    this.remnant = '';
  }


  _transform(chunk, encoding, callback) {
    // // Convert buffer to a string for splitting
    if (Buffer.isBuffer(chunk)) {
      chunk = chunk.toString('utf8');
    }

    if (this.remnant.length > 0) {
      chunk = this.remnant + chunk;
      this.remnant = '';
    }

    const lines = chunk.split(this.delimeter);

    if (chunk.search(this.delimeter + '$') === -1) {
      this.remnant = lines.pop();
    }


    lines.forEach(function (line) {
      if (line !== '') { this.push(line); }
    }, this);

    callback();
  }

  _flush(callback) {
    if (this.remnant.length > 0) {
      this.push(this.remnant);
      this.remnant = '';
    }
    callback();
  }
}

module.exports = LineSplitStream;
