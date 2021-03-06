/**
 * @file chat command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!Bastion.credentials.cleverbotAPIkey) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('noCredentials', 'errors'), string('noCredentials', 'errorMessage', 'Cleverbot API'), message.channel);
  }

  Bastion.db.get(`SELECT chat FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, chatStats;
    if (row.chat === 'false') {
      Bastion.db.run(`UPDATE guildSettings SET chat='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.green;
      chatStats = 'Enabled chat in this server. Now I\'ll respond if anyone mentions me, Ain\'t that cool? :sunglasses:';
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET chat='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.red;
      chatStats = 'Disabled chat in this server. Now I\'m gonna miss talking with you. :disappointed:';
    }

    message.channel.send({
      embed: {
        color: color,
        description: chatStats
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'chat',
  description: string('chat', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'chat',
  example: []
};
