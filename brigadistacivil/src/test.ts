import { Injectable } from '@angular/core';

@Injectable()
export default class Environment {
  public static env = 'development';
  public static apiBase = 'http://10.0.0.5:8484/api';
  public static baseUrl = 'http://10.0.0.5:8484';
}
