/**
 * @file farewellMessage command
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

  if (args.length < 1) {
    Bastion.db.get(`SELECT farewellMessage FROM guildSettings WHERE guildID=${message.guild.id}`).then(guild => {
      message.channel.send({
        embed: {
          color: Bastion.colors.dark_grey,
          title: 'Farewell message:',
          description: guild.farewellMessage
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    Bastion.db.run(`UPDATE guildSettings SET farewellMessage="${args.join(' ').replace(/"/g, '\'')}" WHERE guildID=${message.guild.id}`).catch(e => {
      Bastion.log.error(e);
    });

    message.channel.send({
      embed: {
        color: Bastion.colors.green,
        title: 'Farewell message set to:',
        description: args.join(' ')
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'fmsg' ],
  enabled: true
};

exports.help = {
  name: 'farewellmessage',
  description: string('farewellMessage', 'commandDescription'),
  botPermission: '',
  userPermission: 'ADMINISTRATOR',
  usage: 'farewellMessage [Message]',
  example: [ 'farewellMessage Goodbye $username. Hope to see you soon!' ]
};
