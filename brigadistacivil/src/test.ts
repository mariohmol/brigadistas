import { Injectable } from '@angular/core';

@Injectable()
export default class Environment{
  public static env: string = "development";
  public static apiBase: string = "http://10.0.0.5:8484/api";
  public static baseUrl: string = "http://10.0.0.5:8484";
}
