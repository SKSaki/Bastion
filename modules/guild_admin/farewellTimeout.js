/**
 * @file farewellTimeout command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!/^(([0-2]?[0-9]?[0-9])|300)$/.test(args[0])) {
    args[0] = '0';
  }
  Bastion.db.run(`UPDATE guildSettings SET farewellTimeout=${args[0]} WHERE guildID=${message.guild.id}`).catch(e => {
    Bastion.log.error(e);
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.green,
      title: 'Farewell Timeout set to:',
      description: args[0] > 60 ? `${args[0] / 60} min.` : args[0] === 0 ? '∞' : `${args[0]} sec.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ftout' ],
  enabled: true
};

exports.help = {
  name: 'farewelltimeout',
  description: string('farewellTimeout', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'farewellTimeout [time_in_seconds]',
  example: [ 'farewellTimeout 120', 'farewellTimeout' ]
};
