import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import Environment from '../environment';

/*
  Generated class for the BaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BaseService {
  apiUrl: string;
  env: string = "production"; //production or development or test
  profile: any;

  constructor(public http: Http) {
    this.http=http;

    if(window.location.hostname==="app.brigadistacivil.com.br") this.env="production";
    else this.env=Environment.env;

    if(this.env=="development" && window.location.pathname.contains("assets")) this.env=="test";

    if(this.env=="development"){
      this.apiUrl = "http://localhost:8484";
    }else if(this.env=="test"){
      this.apiUrl = "http://10.0.0.4:8484";
    }
    else{
      this.apiUrl = "http://app.brigadistacivil.com.br";
    }
  }

  doHeaders(data:any=null){
    let headers;
    if(!this.profile && 'profile' in localStorage){
      this.profile  = JSON.parse(localStorage['profile']);
    }
    if(this.profile && (!data || !data.username)){
      headers = new Headers({
        'Content-Type': 'application/json' ,
        'Authorization': 'Basic ' + btoa(this.profile.username + ':' + this.profile.password)
      });
    }else{
      headers = new Headers({'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(data.username + ':' + data.password)});
    }
    return headers;
  }

  doGet(url: string){
    return new Promise( (resolve,reject) => {
      let headers=this.doHeaders(null);
      let options = new RequestOptions({ headers: headers, method: "get" });
      return this.http.get(this.apiUrl+url, options  )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          },
          error => {
            reject(error);
        });
    });
  }

  doPost(url: string,data: any){
    return new Promise( (resolve,reject) => {
      let headers=this.doHeaders(data);  //let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers, method:  'post' });
      if(!data) data={};

      return this.http.post(this.apiUrl+url,  JSON.stringify(data), options  )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          },
          error => {
            reject(error);
        });
    });
  }


  doPut(url: string,data: any=null){
    return new Promise( (resolve,reject) => {
      let headers=this.doHeaders(data);
      let options = new RequestOptions({ headers: headers, method:  'put' });
      if(!data) data={};

      return this.http.put(this.apiUrl+url,  JSON.stringify(data), options  )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          },
          error => {
            reject(error);
        });
    });
  }

  doDelete(url: string){
    return new Promise( (resolve,reject) => {
      let headers=this.doHeaders();
      let options = new RequestOptions({ headers: headers, method:  'delete' });
      return this.http.delete(this.apiUrl+url, options  )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          },
          error => {
            reject(error);
        });
    });
  }

}
