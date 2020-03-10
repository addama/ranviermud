'use strict';

const { WorldAudience, RoomAudience, PrivateAudience } = require('ranvier');
const { Channel } = require('ranvier').Channel;

module.exports = [
	new Channel({
		name: 'Global',
		aliases: ['/g', '/1', 'global', '/global'],
		descriptions: 'Global chat',
		color: ['bold', 'green'],
		audience: new WorldAudience()
	}),
	
	new Channel({
		name: 'Local',
		aliases: ['/say', 'local', '/local', 'say', '.'],
		descriptions: 'Local chat',
		color: ['bold', 'cyan'],
		audience: new RoomAudience(),
		formatter: {
			sender: function (sender, target, message, colorify) {
				return colorify(`You say, '${message}'`);
			},

			target: function (sender, target, message, colorify) {
				return colorify(`${sender.name} says, '${message}'`);
			}
		}
	}),
	
	new Channel({
		name: 'Whisper',
		aliases: ['/w', '/whisper', 'tell', '/tell', '/t', '>'],
		descriptions: 'Global chat',
		color: ['bold', 'green'],
		audience: new PrivateAudience(),
		formatter: {
			sender: function (sender, target, message, colorify) {
				return colorify(`To ${target.name}, you whisper '${message}'`);
			},

			target: function (sender, target, message, colorify) {
				return colorify(`${sender.name} whispers '${message}'`);
			}
		}
	})

];