'use strict';

const { Broadcast, Logger, RoomManager } = require('ranvier');
const signID = 'world:port_sign';
const travelSeconds = 5;

const refreshSign = function(room, sign) {
	
};

module.exports = {
	listeners: {
		ready: state => function() {			
			let destinations = this.getMeta('destinations');
			let hasSign = false;
			if (this.items.length) {
				for (let item of this.items) {
					if (item.id === signID) hasSign = true;
				}
			}
			
			if (!hasSign) {
				Logger.log('PORT:', this.id, 'creating signage');
				let sign = this.spawnItem(state, signID);
				sign.id = signID + '_' + this.id;
				let destinations = this.getMeta('destinations');
				if (!destinations || destinations.length < 1) {
					sign.description = "There are no ports connected to this one";
				} else {
					sign.description += '\r\n\nDestinations:';
					for (var i = 0; i < destinations.length; i++) {
						let index = destinations[i];
						sign.description += '\r\n[' + i + '] ' + index.title;
					}
				}
				this.addItem(sign);
			}
		},
	},
};