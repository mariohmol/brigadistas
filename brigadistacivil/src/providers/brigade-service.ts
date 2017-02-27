import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';

@Injectable()
export class BrigadeService extends BaseService {
  public static dados: any= {};

  constructor(public http: Http) {
    super(http);
    console.log('Hello BrigadeService Provider');
  }

  getBrigades(){
    return this.doGet("/brigade/");
  }

  addBrigade(brigade){
    return this.doPost("/brigade/",brigade);
  }

  addRelationBrigade(brigadeId,relation,userId){
    return this.doPost(`/brigade/${brigadeId}/${relation}`,{userId});
  }

  removeRelationBrigade(brigadeId,relation,userId){
    return this.doDelete(`/brigade/${brigadeId}/${relation}/${userId}`);
  }

}
