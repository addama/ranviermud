'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
	aliases: [ 'test' ],
	usage: 'test',
	command: state => (args, player) => {
		player.emit('travel', args);
	}
};
