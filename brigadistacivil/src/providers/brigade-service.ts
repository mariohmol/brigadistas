import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';

@Injectable()
export class BrigadeService extends BaseService {
  public static data: any= {};

  constructor(public http: Http) {
    super(http);
  }

  getBrigades(){
    return this.doGet('/brigade/');
  }

  getBrigade(id){
    return this.doGet(`/brigade/${id}`);
  }

  addBrigade(brigade){
    if(brigade._id){
      return this.updateBrigade(brigade);
    }
    return this.doPost('/brigade/',brigade);
  }

  updateBrigade(brigade){
    return this.doPut(`/brigade/${brigade._id}`,brigade);
  }

  deleteArea(brigadeId){
    return this.doDelete(`/brigade/area/${brigadeId}`);
  }

  addRelationBrigade(brigadeId,relation,userId=null){
    return this.doPost(`/brigade/relation/${brigadeId}/${relation}`,{userId});
  }

  removeRelationBrigade(brigadeId,relation,userId=null){
    return this.doDelete(`/brigade/relation/${brigadeId}/${relation}/${userId}`);
  }

  userPerms(loginData,brigade){
    if(!loginData) return {isLeader: false,readonly: true,isBrigade: false}
    let isLeader = brigade.leaders && brigade.leaders.find(d=>{return d._id==loginData._id})!=null
    let readonly=true;
    let isBrigade = isLeader ||
            brigade.brigades && brigade.brigades.find(d=>{return d._id==loginData._id})!=null ||
            brigade.requested && brigade.requested.find(d=>{return d._id==loginData._id})!=null;

    if(brigade && brigade.leaders && brigade.leaders.find(d=>{return d._id==loginData._id}))
      readonly=false;
    return {isLeader,readonly,isBrigade};
  }

}
