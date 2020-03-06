'use strict';

const { Logger, Config } = require('ranvier');

module.exports = {
	event: state => (socket, args) => {
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
		
		//if (!args || !args.dontwelcome) {
			socket.write('Welcome, what is your name? ');
		//}

		socket.once('data', async name => {
			name = name.toString().trim();

			const invalid = validateName(name);
			
			if (invalid) {
				socket.write(invalid + '\r\n');
				return socket.emit('login', socket);
			}

			name = name[0].toUpperCase() + name.slice(1);

			let account = null;
			try {
				account = await state.AccountManager.loadAccount(name);
			} catch (e) {
				Logger.error(e.message);
			}

			if (!account) {
				Logger.error(`No account found as ${name}.`);
				return socket.emit('create-account', socket, name);
			}

			if (account.banned) {
				socket.write('This account has been banned.\r\n');
				socket.end();
				return;
			}

			if (account.deleted) {
				socket.write('This account has been deleted.\r\n');
				socket.end();
				return;
			}

			return socket.emit('password', socket, { account });
		});
	}
};
