import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {Profile} from 'api/models';
import {Chats, Messages,Brigades} from './collections';

import 'meteor/accounts-password';

const nonEmptyString = Match.Where((str: any) => {
  check(str, String);
  return str.length > 0;
});



  Brigades.allow({
    insert: function (userId, doc) {
      return true;
    }
  })

Meteor.methods({
  brigadesInsert(brigade) {
    console.log(brigade)
    check(brigade.name, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    brigade.createdAt=new Date();
    console.log(brigade,"oioioioiisssssss")
    return Brigades.insert(brigade);
  }
});


Meteor.methods({
  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(profile, {
      name: nonEmptyString
    });

    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },

  addChat(receiverId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(receiverId, nonEmptyString);

    if (receiverId == this.userId) throw new Meteor.Error('illegal-receiver',
      'Receiver must be different than the current logged in user');

    const chatExists = !!Chats.find({
      memberIds: {$all: [this.userId, receiverId]}
    }).count();

    if (chatExists) throw new Meteor.Error('chat-exists',
      'Chat already exists');

    const chat = {
      memberIds: [this.userId, receiverId]
    };

    Chats.insert(chat);
  },

  removeChat(chatId: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to remove chat');

    check(chatId, nonEmptyString);

    const chatExists = !!Chats.find(chatId).count();

    if (!chatExists) throw new Meteor.Error('chat-not-exists',
      'Chat doesn\'t exist');

    Messages.remove({chatId});
    Chats.remove(chatId);
  },

  addMessage(chatId: string, content: string): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new message');

    check(chatId, nonEmptyString);
    check(content, nonEmptyString);

    const chatExists = !!Chats.find(chatId).count();

    if (!chatExists) throw new Meteor.Error('chat-not-exists',
      'Chat doesn\'t exist');

    Messages.insert({
      senderId: this.userId,
      chatId: chatId,
      content: content,
      createdAt: new Date()
    });
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    signin(username: string,password: string, profile: Object): void {
      Accounts.createUser({username: username,email: username, password: password, profile: profile})
    }
  });

}
