/**
 * @file flip command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  let outcomes = [
    'Heads',
    'Tails'
  ];
  let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  // let outcome = outcomes.random();
  if (args[0] && parseInt(args[0])) {
    for (let i = 1; i < args[0]; i++) {
      outcome += `, ${outcomes[Math.floor(Math.random() * outcomes.length)]}`;
      // outcome += `, ${outcomes.random()}`;
    }
  }

  message.channel.send({
    embed: {
      color: Bastion.colors.blue,
      title: 'You flipped:',
      description: outcome
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'flip',
  description: string('flip', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'flip [no_of_coins]',
  example: [ 'flip', 'flip 5' ]
};
