'use strict';

const { Broadcast, EffectFlag, Logger } = require('ranvier');
const { random } = require('../lib/Utility.js');
const travelChar = '.';
const milestoneChar = ':';
const travelVarianceMin = 0;
const travelVarianceMax = 10;

module.exports = {
	/*
	The traveling effect is a way to add time-gating to travel segments instead of moving everywhere instantaneously. 
	
	The travel is represented by a graphical bar. Commands are not blocked during this time, so the bar can be interrupted by either player commands or channel responses, but such is the price we pay for our experiment.
	
	The effect can be applied anywhere, but the intention is to move the player after the effect ends. This can be something like a teleport spell that takes time to start up, or using a vehicle/flight to move vast distances where the stuff between your start and end aren't important.
	*/
	flags: [ EffectFlag.TRAVEL ],
	config: {
		name: 'Traveling',
		type: 'travel',
		unique: true,
		duration: 10 * 1000,
		tickInterval: 1,
		refreshes: false,
		persists: true,
		maxStacks: 1,
		hidden: false,
		autoActivate: true
	},
	state: {
		nextRoom: false
	},
	listeners: state => ({
		effectAdded: function() {
			// Just to make sure everything is in order
			if (!this.state.nextRoom) this.remove();
		},
		effectActivated: function() {
			// Add some variance, because in travel there is always variance
			this.config.duration += random(travelVarianceMin,travelVarianceMax) * 1000;
		},
		effectDeactivated: function() {
			// Once the effect ends, move the player to their destination
			Broadcast.sayAt(this.target, ']\r\nThe ship arrives at ' + this.state.nextRoom.title + ' and you disembark');
			Broadcast.sayAt(this.target, '');
			this.target.moveTo(this.state.nextRoom, () => {
				Broadcast.atExcept(this.state.nextRoom, this.target.name + ' disembarks from a passenger ship', this.target);
				state.CommandManager.get('look').execute('', this.target);
				Broadcast.prompt(this.target);
			});
		},
		updateTick: function() {
			// Display a graphical bar every second
			// Travaling (18s) [....:....:....:...]
			if (this.elapsed < 1000) {
				state.CommandManager.get('look').execute('', this.target);
				Broadcast.sayAt(this.target, '\r\nThe ship begins its voyage toward ' + this.state.nextRoom.title);
				Broadcast.at(this.target, 'Traveling (' + ((this.config.duration/1000) - 1) + 's) [');
			} else {
				Broadcast.at(this.target, (this.elapsed % 5000 <= 999) ? milestoneChar : travelChar);
			}
		}
	})
};