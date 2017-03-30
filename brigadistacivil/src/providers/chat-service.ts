import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';

@Injectable()
export class ChatService extends BaseService {
  public static dados: any= {};

  constructor(public http: Http) {
    super(http);
  }

  getChats(){
    return this.doGet('/chat/');
  }

  getChat(id){
    return this.doGet(`/chat/${id}`);
  }

  getChatByFire(fire){
    return this.doGet(`/chat/fire/${fire._id}`);
  }

  addChat(chat){
    return this.doPost('/chat/',chat);
  }

  deleteChat(chatId){
    return this.doDelete(`/chat/${chatId}`);
  }

  getMessages(){
    return this.doGet(`/chat/message/`);
  }

  addMessage(message){
    return this.doPost(`/chat/message/${message.chat._id}`,message);
  }

  updateMessages(message){
    return this.doPut(`/chat/message/${message._id}`,message);
  }

}
