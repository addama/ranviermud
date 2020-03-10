'use strict';

const fs = require('fs');
const { EventUtil } = require('ranvier');
const file = __dirname + '/../resources/motd';
/**
 * MOTD event
 */
module.exports = {
  event: state => socket => {
    const motd = fs.readFileSync(file).toString('utf8');
    if (motd) EventUtil.genSay(socket)(motd);
    return socket.emit('login', socket);
  }
};
