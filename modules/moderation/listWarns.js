/**
 * @file listWarns command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

const warns = require('./warn').warns;

exports.run = (Bastion, message) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!warns[message.guild.id]) {
    return message.channel.send({
      color: Bastion.colors.green,
      description: 'No one has been warned yet.'
    }).catch(e => {
      Bastion.log.error(e);
    });
  }

  let warnedUsers = [];
  Object.keys(warns[message.guild.id]).forEach(id => {
    warnedUsers.push(message.guild.members.get(id).user.tag);
  });

  message.channel.send({
    embed: {
      color: Bastion.colors.orange,
      title: 'Warning List',
      description: warnedUsers.join('\n')
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'warns' ],
  enabled: true
};

exports.help = {
  name: 'listwarns',
  description: string('listWarns', 'commandDescription'),
  botPermission: '',
  userPermission: 'KICK_MEMBERS',
  usage: 'listWarns',
  example: []
};
