import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BaseService {
  apiUrl: string;
  env: string = "production";
  //env: string = "development";
  profile: any;

  constructor(public http: Http) {
    this.http=http;

    if(this.env=="development"){
      this.apiUrl = "http://localhost:8080";
    }else{
      //this.apiUrl = "http://192.168.0.3:8288";
      this.apiUrl = "https://brigadistacivil.com.br";
    }
  }

  doPost(url: string,data: any){
    return new Promise( (resolve,reject) => {
      let headers = new Headers({ 'Content-Type': 'application/json' }); //let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers, method: "post" });
      if(!data) data={};
      if(!this.profile && 'profile' in localStorage){
        this.profile  = JSON.parse(localStorage['profile']);
      }
      if(this.profile){
        data.username=this.profile.username;
        data.password=this.profile.password;
      }

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

}
