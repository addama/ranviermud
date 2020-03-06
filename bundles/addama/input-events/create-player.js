'use strict';

const { EventUtil, Config } = require('ranvier');

/**
 * Player creation event
 */
module.exports = {
	event : (state) => (socket, args) => {
		function validateName(name) {
			const maxLength = Config.get('maxAccountNameLength');
			const minLength = Config.get('minAccountNameLength');

			if (!name) return 'Please enter a name.';
			if (name.length > maxLength) return 'Too long, try a shorter name.';
			if (name.length < minLength) return 'Too short, try a longer name.';

			if (!/^[a-z]+$/i.test(name)) {
			return 'Your name may only contain A-Z without spaces or special characters.';
			}

			return false;
		}
		
		const say = EventUtil.genSay(socket);
		const write = EventUtil.genWrite(socket);

		write("<bold>What would you like to name your character?</bold> ");
		socket.once('data', name => {
			name = name.toString().trim();
			const invalid = validateName(name);

			say('');
			if (invalid) {
				say(invalid);
				return socket.emit('create-player', socket, args);
			}

			name = name[0].toUpperCase() + name.slice(1);

			const exists = state.PlayerManager.exists(name);

			if (exists) {
				say(`That name is already taken.`);
				return socket.emit('create-player', socket, args);
			}

			args.name = name;
			return socket.emit('player-name-check', socket, args);
		});
	}
};
