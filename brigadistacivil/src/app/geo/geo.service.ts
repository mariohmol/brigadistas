import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BaseService } from '../core/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GeoService extends BaseService {
  public static dados: any = {};

  constructor(public http: HttpClient) {
    super(http);
  }

  getItems() {
    return this.doGet('/geo/item/');
  }

  getItemsByLoc(lng, lat) {
    return this.doGet(`/geo/item/${lng}/${lat}`);
  }

  getItem(id) {
    return this.doGet(`/geo/item/${id}`);
  }

  addItem(item) {
    return this.doPost('/geo/item/', item);
  }

  updateItem(item) {
    return this.doPut(`/geo/item/${item._id}`, item);
  }

  changeItemStatus(item, status) {
    return this.doPut(`/geo/item/status/${item._id}/${status}`);
  }

}
