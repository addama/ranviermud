'use strict';

const { Broadcast, Logger } = require('ranvier');
const ArgParser = require('../../bundle-example-lib/lib/ArgParser');

module.exports = {
	aliases: [ 'sail' ],
	usage: 'travel <location>',
	command: state => (args, player, arg0) => {
		let prevRoom = player.room;

		if (prevRoom && prevRoom.getMeta('isPort')) {
			let destinations = prevRoom.getMeta('destinations');
			let nextRoom = state.RoomManager.getRoom(destinations[args[0]].id);
			if (nextRoom) {
				Logger.log('SAIL:', player.name, args[0], nextRoom.title);
				Broadcast.sayAt(player, Broadcast.progress(80, 0, 'cyan', '>', ' ', '[]'));
				player.moveTo(nextRoom, () => {
					Broadcast.sayAt(player, 'You board a passenger ship to ' + nextRoom.title);
					state.CommandManager.get('look').execute('', player);
				});
				Broadcast.sayAt(prevRoom, player.name + ' boarded a ship and sailed to ' + nextRoom.title);
				Broadcast.sayAtExcept(nextRoom, player.name + ' disembarks from a ship', player);
			} else {
				Broadcast.sayAt(player, 'Please select a valid port number from the sign!');
			}
		} else {
			Broadcast.sayAt(player, 'You can only travel at a port!');
		}
	}
};
