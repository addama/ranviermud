'use strict';

const { Config, Player } = require('ranvier');

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = {
  event: state => {
    const startingRoomRef = Config.get('startingRoom');
    if (!startingRoomRef) {
      Logger.error('No startingRoom defined in ranvier.json');
    }

    return async (socket, args) => {
      let player = new Player({
        name: args.name,
        account: args.account,
		metadata: {
			wallet: 1000
		}
      });


      // TIP:DefaultAttributes: This is where you can change the default attributes for players
      const defaultAttributes = {
		farming: 0,
		extroversion: 3,
		stamina: 100
      };

      for (const attr in defaultAttributes) {
        player.addAttribute(state.AttributeFactory.create(attr, defaultAttributes[attr]));
      }

      args.account.addCharacter(args.name);
      args.account.save();

     //player.setMeta('class', args.playerClass);

      const room = state.RoomManager.getRoom(startingRoomRef);
      player.room = room;
      await state.PlayerManager.save(player);

      // reload from manager so events are set
      player = await state.PlayerManager.loadPlayer(state, player.account, player.name);
      player.socket = socket;

      socket.emit('done', socket, { player });
    };
  }
};
