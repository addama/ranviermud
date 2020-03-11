'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
	listeners: {
		move: state => function (movementCommand) {
			const { roomExit } = movementCommand;

			if (!roomExit) {
				return Broadcast.sayAt(this, "You can't go that way!");
			}

			if (this.isInCombat()) {
				return Broadcast.sayAt(this, 'You are in the middle of a fight!');
			}

			const nextRoom = state.RoomManager.getRoom(roomExit.roomId);
			const oldRoom = this.room;

			const door = oldRoom.getDoor(nextRoom) || nextRoom.getDoor(oldRoom);

			if (door) {
				if (door.locked) {
					return Broadcast.sayAt(this, "The door is locked.");
				}

				if (door.closed) {
					return Broadcast.sayAt(this, "The door is closed.");
				}
			}

			this.moveTo(nextRoom, _ => {
				state.CommandManager.get('look').execute('', this);
			});

			Broadcast.sayAt(oldRoom, `${this.name} leaves.`);
			Broadcast.sayAtExcept(nextRoom, `${this.name} enters.`, this);

			for (const follower of this.followers) {
				if (follower.room !== oldRoom) continue;

				if (follower.isNpc) {
					follower.moveTo(nextRoom);
				} else {
					Broadcast.sayAt(follower, `\r\nYou follow ${this.name} to ${nextRoom.title}.`);
					follower.emit('move', movementCommand);
				}
			}
		},
		
		save: state => async function (callback) {
			await state.PlayerManager.save(this);
			if (typeof callback === 'function') callback();
		},
	}
};