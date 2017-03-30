import { Injectable } from '@angular/core';
import { Http} from '@angular/http'; //RequestOptions
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';
/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService extends BaseService {
  public static loginData: any;
  public static locations: [any]= <any>[];

  constructor(public http: Http) {
    super(http);
  }

  login(username: string, password: string) {
    UserService.loginData=null;
    if (UserService.loginData) {
      return Promise.resolve(UserService.loginData);
    }

    return new Promise( (resolve,reject) => {
      let data = {username: username,password: password};
      this.doPost('/user/login',data).then(retorno => {
        if(!('error' in retorno)) UserService.loginData = retorno;
        resolve(UserService.loginData);
      }).catch( error => {
        reject(error);
      });
    });
  }

  logout(){
    let retorno =  null;//this.doPost('/attrs/logout/',{});
    localStorage['profile']=null;
    localStorage.removeItem('profile');
    localStorage.removeItem('base_token');
    let deviceToken = localStorage['deviceToken']
    localStorage.clear();
    localStorage['deviceToken']=deviceToken;
    UserService.loginData=null;
    return retorno;
  }

  storeDeviceToken(type,id) {
     if(type=='android'){
  		return this.doPost('/user/pushregister/android/',{ androidkey: id});
  	}else {
      return this.doPost('/user/pushregister/ios/',{ ioskey: id});
    }
  }

  removeDeviceToken(type,id) {
     if(type=='android'){
      return this.doPost('/user/pushunregister/android/',{ androidkey: id});
    }else {
      return this.doPost('/user/pushunregister/ios/',{ ioskey: id});
    }
  }

  recover(email) {
    return this.doGet('/user/recover/'+email+'/');
  }

  recoverCheck(key) {
    return this.doGet('/user/recovercheck/'+key+'/');
  }

  recoverPassword(key,password) {
    return this.doPost('/user/recoverpass/'+key+'/',{password});
  }

  register(data) {
    return this.doPost('/user/register',data);
  }

  saveLocation(lat, lng, fireId) {
    let data = {
      lat, lng, fireId
    }
    return this.doPost('/fire/position/'+fireId, data).then(a=>{
      UserService.locations = <any>UserService.locations.filter(f=>{return f.lat!=data.lat && f.lng!=data.lng});
      if(UserService.locations.length>0) {
        const {lat,lng,fireId} = UserService.locations[0];
        this.saveLocation(lat,lng,fireId);
      }
    }).catch(e=>{
      UserService.locations.push(data);
    });
  }

  getUser(id){
    return this.doGet(`/user/profile/${id}/`);
  }

  findUser(name){
    if(!name)name="";
    return this.doGet(`/user/?name=${name}`);
  }

  getMe(){
    return this.doPost(`/user/login`,{});
  }

  updateUser(user){
    return this.doPost(`/user/update`,{user});
  }

}
