/**
 * @file iAmNot command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!message.guild.me.hasPermission(this.help.botPermission)) {
    /**
     * Bastion has missing permissions.
     * @fires bastionMissingPermissions
     */
    return Bastion.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  Bastion.db.get(`SELECT selfAssignableRoles FROM guildSettings WHERE guildID=${message.guild.id}`).then(row => {
    if (!row) return;

    let role = message.guild.roles.find('name', args.join(' '));
    if (role === null) return;
    let selfAssignableRoles = JSON.parse(row.selfAssignableRoles);
    if (!selfAssignableRoles.includes(role.id)) return;
    if (message.guild.me.highestRole.comparePositionTo(role) <= 0) return Bastion.log.info('I don\'t have permission to use this command on that role.');

    message.guild.members.get(message.author.id).removeRole(role).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          description: `${message.author}, you have been removed from **${role.name}** role.`
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'idontwant', 'idonthave' ],
  enabled: true
};

exports.help = {
  name: 'iamnot',
  description: string('iAmNot', 'commandDescription'),
  botPermission: 'MANAGE_ROLES',
  userPermission: '',
  usage: 'iAmNot <role name>',
  example: [ 'iAmNot Looking to play' ]
};
