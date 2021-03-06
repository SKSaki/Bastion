/**
 * @file minecraft command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const MINECRAFT = require('gamequery');

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(args = args[0])) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.split(':');
  let host = args[0];

  if (host === '127.0.0.1') {
    return message.channel.send({
      embed: {
        description: 'There is no place like `127.0.0.1`'
      }
    });
  }

  let port;
  if (args[1]) {
    port = parseInt(args[1]);
  }
  else {
    port = 25565;
  }

  MINECRAFT.query({
    type: 'minecraft',
    host: host,
    port: port
  }).then(data => {
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: data.name,
        description: '[Minecraft](https://minecraft.net/)',
        fields: [
          {
            name: 'Server IP',
            value: `${host}:${port}`,
            inline: true
          },
          {
            name: 'Private',
            value: data.password,
            inline: true
          },
          {
            name: 'Players',
            value: `${data.players.length}/${data.maxplayers}`,
            inline: true
          },
          {
            name: 'Map',
            value: data.raw.map,
            inline: true
          },
          {
            name: 'Gametype',
            value: data.raw.gametype,
            inline: true
          }
        ],
        footer: {
          text: `Version: ${data.raw.version}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(() => {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('connection', 'errors'), string('invalidIPPort', 'errorMessage'), message.channel);
  });
};

exports.config = {
  aliases: [ 'mc' ],
  enabled: true
};

exports.help = {
  name: 'minecraft',
  description: string('minecraft', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'minecraft <MC_SERVER_IP>[:PORT]',
  example: [ 'minecraft 139.59.31.129', 'minecraft 139.59.31.129:25565' ]
};
