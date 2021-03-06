/**
 * @file filterInvite command
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
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  Bastion.db.get(`SELECT filterInvite FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    let color, filterInviteStats;
    if (row.filterInvite === 'false') {
      Bastion.db.run(`UPDATE guildSettings SET filterInvite='true' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.green;
      filterInviteStats = 'Enabled automatic deletion of discord server invites posted in this server.';
    }
    else {
      Bastion.db.run(`UPDATE guildSettings SET filterInvite='false' WHERE guildID=${message.guild.id}`).catch(e => {
        Bastion.log.error(e);
      });
      color = Bastion.colors.red;
      filterInviteStats = 'Disabled automatic deletion of discord server invites posted in this server.';
    }

    message.channel.send({
      embed: {
        color: color,
        description: filterInviteStats
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'filterinv' ],
  enabled: true
};

exports.help = {
  name: 'filterinvite',
  description: string('filterInvite', 'commandDescription'),
  botPermission: 'MANAGE_MESSAGES',
  userPermission: 'ADMINISTRATOR',
  usage: 'filterInvite',
  example: []
};
