import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Chats, Messages} from './collections';
import 'meteor/accounts-password';


Meteor.startup(function() {
  if (Meteor.users.find().count()) return;

  Accounts.createUser({
    username: '+972540000001', password: "123456",
    profile: {
      name: 'Ethan Gonzalez',
      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
    }
  });

  Accounts.createUser({
    username: '+972540000002', password: "123456",
    profile: {
      name: 'Bryan Wallace',
      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
    }
  });

  Accounts.createUser({
    username: '+972540000003', password: "123456",
    profile: {
      name: 'Avery Stewart',
      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
    }
  });

  Accounts.createUser({
    username: '+972540000004', password: "123456",
    profile: {
      name: 'Katie Peterson',
      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
    }
  });

  Accounts.createUser({
    username: '+972540000005', password: "123456",
    profile: {
      name: 'Ray Edwards',
      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
    }
  });
});
