import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';
import { BackgroundGeolocation } from 'ionic-native';

@Injectable()
export class ChatService extends BaseService {
  public static dados: any= {};

  constructor(public http: Http) {
    super(http);
    console.log('Hello ChatService Provider');
  }

  getChats(){
    return this.doGet('/chat/');
  }

  getChat(id){
    return this.doGet(`/chat/${id}`);
  }

  addChat(chat){
    return this.doPost('/chat/',chat);
  }

  deleteChat(chat){
    return this.doDelete(`/chat/${chat._id}`);
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
