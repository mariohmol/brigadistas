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
  public static apiUrl: string;
  public static baseUrl: string;
  public static env: string = "production"; //production or development or test
  public static device: string; //mobile or web
  profile: any;

  constructor(public http: Http) {
    this.http=http;
    if(!BaseService.device) this.initEnvVars();
  }

  initEnvVars(){
    if(window.location.hostname.includes("brigadistacivil.com.br")) BaseService.env="production";
    else BaseService.env=Environment.env;

    if(BaseService.env=="development" && window.location.pathname.includes("asset")) BaseService.env="test";

    if(BaseService.env=="test" && !Environment.apiBase){
      BaseService.apiUrl = "http://10.0.0.4:8484/api";
    }
    else{
      BaseService.apiUrl = Environment.apiBase;
    }
    BaseService.baseUrl = Environment.baseUrl;

    if(window.location.pathname.includes("asset")) BaseService.device="mobile";
    else BaseService.device="web";
  }

  doHeaders(data:any=null){
    let headers;
    if(!this.profile && 'profile' in localStorage){
      this.profile  = JSON.parse(localStorage['profile']);
    }
    if(this.profile && (!data || !data.username)){
      let basictoken;
      if('base_token' in localStorage){
        basictoken = localStorage['base_token'];
      }else{
        basictoken = btoa(this.profile.username + ':' + this.profile.password);
      }
      headers = new Headers({
        'Content-Type': 'application/json' ,
        'Authorization': 'Basic ' + basictoken
      });
    }else if(data){
      headers = new Headers({'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(data.username + ':' + data.password)});
    }else{
        headers = new Headers({'Content-Type': 'application/json'});
    }
    return headers;
  }

  doGet(url: string){
    return new Promise( (resolve,reject) => {
      let headers=this.doHeaders(null);
      let options = new RequestOptions({ headers: headers, method: "get" });
      return this.http.get(BaseService.apiUrl+url, options  )
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          },
          error => {
            reject(error);
        });
    });
  }

  doPost(url: string,data: any,files: any=null){
    return new Promise( (resolve,reject) => {
      let headers=this.doHeaders(data);  //let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      if(files) headers._headers.delete("content-type");
      let options = new RequestOptions({ headers: headers, method:  'post' });
      if(!data) data={};

      let formData;

      if(files){
        formData = new FormData()
        if(files.length==1){
          formData.append("uploads", files[0], files[0].name);
        }else{
          for (let i = 0; i < files.length; i++) {
              formData.append("uploads[]", files[i], files[i].name);
          }
        }
      }else{
        formData=JSON.stringify(data);
      }

      return this.http.post(BaseService.apiUrl+url, formData, options  )
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

      return this.http.put(BaseService.apiUrl+url,  JSON.stringify(data), options  )
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
      return this.http.delete(BaseService.apiUrl+url, options  )
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
