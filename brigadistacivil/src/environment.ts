import { Injectable } from '@angular/core';

@Injectable()
export default class Environment {
  public static env = 'development';
  public static apiBase = 'http://localhost:8484/api';
  public static baseUrl = 'http://localhost:8484';
}
