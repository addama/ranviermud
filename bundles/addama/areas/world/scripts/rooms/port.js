'use strict';

const { Broadcast, Logger } = require('ranvier');

module.exports = {
	listeners: {
		ready: state => function() {
			let destinations = this.getMeta('destinations');
			let hasSign = false;
			if (this.items.length) {
				for (let item of this.items) {
					if (item.id === 'port_sign') hasSign = true;
				}
			}
			
			if (!hasSign) {
				Logger.log('PORT:', this.title, this.id, 'creating signage');
				let sign = this.spawnItem(state, 'world:port_sign');
				let destinations = this.getMeta('destinations');
				if (!destinations || destinations.length < 1) {
					sign.description = "There are no ports connected to this one";
				} else {
					sign.description += '\r\n\nDestinations:';
					for (var i = 0; i < destinations.length; i++) {
						Logger.log('PORT:', this.title, this.id, i, destinations[i]);
						let dest = state.RoomManager.getRoom(destinations[i]);
						if (dest) {
							sign.description += '\r\n[' + i + '] ' + dest.title;
						}
					}
				}
				this.addItem(sign);
			}
		},
	},
};