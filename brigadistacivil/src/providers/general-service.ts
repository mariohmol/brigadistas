import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';
/*
  Generated class for the GeneralService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeneralService extends BaseService {
  public static dados: any= {};

  constructor(public http: Http) {
    super(http);
    console.log('Hello GeneralService Provider');
  }

  /*
  cidades(search) {
    return this.doPost("/attrs/cidade/?search="+search,{search: search});
  }*/


}
