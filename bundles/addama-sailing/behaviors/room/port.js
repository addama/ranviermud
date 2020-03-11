'use strict';

const { Broadcast, Logger } = require('ranvier');
const signID = 'ocean:port_sign';

module.exports = {
	listeners: {
		ready: state => function() {
			/* On room#ready, spawn a port sign, then change its description to match the list of destinations listed in this.metadata.destinations, giving each one a numeric index that is used by the travel command
			
			Doing it this way ensures that changing destinations for a port only has to happen in one place, rather than having to edit rooms, items, behaviors/scripts, and commands, potentially forgetting how they link up
			*/
			let destinations = this.getMeta('destinations');
			let hasSign = false;
			// Check if a sign exists already
			if (this.items.length) {
				for (let item of this.items) {
					if (item.id === signID) hasSign = true;
				}
			}
			
			if (!hasSign) {
				// Create a new sign
				Logger.log('PORT:', this.id, 'creating signage');
				let sign = this.spawnItem(state, signID);
				sign.id = signID + '_' + this.id;
				let destinations = this.getMeta('destinations');
				if (!destinations || destinations.length < 1) {
					sign.description = "There are no ports connected to this one";
				} else {
					// Add each destination to the sign description with a numeric index
					sign.description += '\r\n\nDestinations:';
					for (var i = 0; i < destinations.length; i++) {
						let index = destinations[i];
						sign.description += '\r\n[' + i + '] ' + index.title;
					}
				}
				// Give the sign to the room
				this.addItem(sign);
			}
		},
	},
};