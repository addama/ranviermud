'use strict';

const { Broadcast, PlayerRoles } = require('ranvier');

/**
 * Command to allow you to reload a command's definition from disk without restarting the server
 */
module.exports = {
	requiredRole: PlayerRoles.ADMIN,
	usage: 'hotfix <command name>',
	command: state => (commandName, player) => {
		if (!commandName || !commandName.length) {
			return Broadcast.sayAt(player, 'Hotfix which command?');
		}

		const command = state.CommandManager.get(commandName);
		if (!command) {
			return Broadcast.sayAt(player, 'There is no such command, restart the server to add new commands.');
		}

		delete require.cache[require.resolve(command.file)];
		Broadcast.sayAt(player, `<b><red>HOTFIX</red></b>: Reloading [${commandName}]...`);

		const newCommand = state.BundleManager.createCommand(command.file, command.name, command.bundle);
		state.CommandManager.add(newCommand);
		Broadcast.sayAt(player, `<b><red>HOTFIX</red></b>: Done!`);
	}
};