/**
 * @file kick command
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
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (!message.guild.available) return Bastion.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);
  let user = message.mentions.users.first();
  if (!user) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(message.guild.members.get(user.id).highestRole) <= 0) return Bastion.log.info(string('lowerRole', 'errorMessage'));

  if (!message.guild.members.get(user.id).kickable) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('forbidden', 'errors'), string('noPermission', 'errorMessage', 'kick', user), message.channel);
  }

  let reason = args.slice(1).join(' ');
  if (reason.length < 1) {
    reason = 'No given reason';
  }

  message.guild.members.get(user.id).kick(reason).then(member => {
    message.channel.send({
      embed: {
        color: Bastion.colors.orange,
        title: 'Kicked',
        fields: [
          {
            name: 'User',
            value: user.tag,
            inline: true
          },
          {
            name: 'ID',
            value: user.id,
            inline: true
          },
          {
            name: 'Reason',
            value: reason,
            inline: false
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
     * Logs moderation events if it is enabled
     * @fires moderationLog
     */
    Bastion.emit('moderationLog', message.guild, message.author, this.help.name, member, reason);

    member.send({
      embed: {
        color: Bastion.colors.orange,
        title: `Kicked from ${message.guild.name} Server`,
        description: `**Reason:** ${reason}`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'k' ],
  enabled: true
};

exports.help = {
  name: 'kick',
  description: string('kick', 'commandDescription'),
  botPermission: 'KICK_MEMBERS',
  userPermission: 'KICK_MEMBERS',
  usage: 'kick @user-mention [Reason]',
  example: [ 'kick @user#0001 Reason for the kick.' ]
};
