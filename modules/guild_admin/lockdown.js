/**
 * @file lockdown command
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

  if (args.remove) {
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: null
    }).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.green,
          title: 'Channel Lockdown Removed',
          description: 'The lockdown on this channel has now been removed, you can now send messages in this channel.',
          footer: {
            text: `Removed by ${message.author.tag}`
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: false
    }).then(() => {
      message.channel.send({
        embed: {
          color: Bastion.colors.red,
          title: 'Channel Lockdown Initiated',
          description: 'This text channel is in lockdown. You do not have permissions to send message in this channel unless you are explicitly allowed.\nAdministrators can remove the lockdown using the `lockdown --remove` command.',
          footer: {
            text: `Initiated by ${message.author.tag}`
          }
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'lockdown',
  description: string('lockdown', 'commandDescription'),
  botPermission: 'MANAGE_ROLES',
  userPermission: 'ADMINISTRATOR',
  usage: 'lockdown [--remove]',
  example: [ 'lockdown', 'lockdown --remove' ]
};
