import { Injectable } from '@angular/core';

@Injectable()
export default class Environment{
  public static env: string = "development";
  public static apiBase: string = "http://localhost:8484/api";
  public static baseUrl: string = "http://localhost:8484";
}
