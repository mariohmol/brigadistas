declare module 'api/models' {
  interface Profile {
    name?: string;
    picture?: string;
  }

  interface Chat {
    _id?: string;
    memberIds?: Array<string>;
    title?: string;
    picture?: string;
    lastMessage?: Message;
    receiverComp?: Tracker.Computation;
    lastMessageComp?: Tracker.Computation;
    deletedAt?: Date;
  }

  interface Message {
    _id?: string;
    chatId?: string;
    senderId?: string;
    ownership?: string;
    content?: string;
    createdAt?: Date;
    deletedAt?: Date;
  }

  interface Brigade {
    _id?: string;
    name?: string;
    desc?: string;
    ownership?: string;
    city?: string;
    createdAt?: Date;
    deletedAt?: Date;
  }

  interface FireAlert {
    _id?: string;
    userId?: string;
    title?: string;
    city?: string;
    createdAt?: Date;
    deletedAt?: Date;
  }
}
