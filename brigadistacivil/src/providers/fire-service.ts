import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';

@Injectable()
export class FireService extends BaseService {
  public static dados: any= {};

  constructor(public http: Http) {
    super(http);
    console.log('Hello FireService Provider');
  }

  getFires(){
    return this.doGet("/fire/");
  }

  addFire(fire){
    return this.doPost("/fire/",fire);
  }
}
