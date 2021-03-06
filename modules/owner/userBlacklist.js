/**
 * @file userBlacklist command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (args.length < 1) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let user = [];
  args.forEach(uid => {
    if ((parseInt(uid) < 9223372036854775807)) {
      user.push(uid);
    }
  });
  user = user.concat(message.mentions.users.map(u => u.id));

  Bastion.db.run('CREATE TABLE IF NOT EXISTS blacklistedUsers (userID TEXT NOT NULL UNIQUE, PRIMARY KEY(userID))').then(() => {
    Bastion.db.all('SELECT userID from blacklistedUsers').then(blUsers => {
      blUsers = blUsers.map(u => u.userID);
      let title, color;
      if (/^(add|\+)$/i.test(args[0])) {
        for (let i = 0; i < user.length; i++) {
          if (blUsers.includes(user[i])) continue;
          Bastion.db.run('INSERT OR IGNORE INTO blacklistedUsers (userID) VALUES (?)', [ user[i] ]).catch(e => {
            Bastion.log.error(e);
          });
        }
        color = Bastion.colors.red;
        title = 'Added to blacklisted users';
      }
      else if (/^(remove|rem|-)$/i.test(args[0])) {
        for (let i = 0; i < user.length; i++) {
          if (!blUsers.includes(user[i])) continue;
          Bastion.db.run(`DELETE FROM blacklistedUsers where userID=${user[i]}`).catch(e => {
            Bastion.log.error(e);
          });
        }
        color = Bastion.colors.green;
        title = 'Removed from blacklisted users';
      }
      else {
        /**
         * The command was ran with invalid parameters.
         * @fires commandUsage
         */
        return Bastion.emit('commandUsage', message, this.help);
      }

      message.channel.send({
        embed: {
          color: color,
          title: title,
          description: user.join(', ')
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
  aliases: [ 'ubl' ],
  enabled: true
};

exports.help = {
  name: 'userblacklist',
  description: string('userBlacklist', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'userblacklist <+|-|add|rem> <@user-mention|user_id>',
  example: [ 'userblacklist add @user#001 224433119988776655', 'userblacklist rem 224433119988776655 @user#0001', 'userblacklist + @user#001 224433119988776655', 'userblacklist - 224433119988776655 @user#0001' ]
};
