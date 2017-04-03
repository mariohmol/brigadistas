import { Injectable } from '@angular/core';

@Injectable()
export default class Environment{
  public static env: string = "production";
  public static apiBase: string = "https://brigadistacivil.com.br/api";
  public static baseUrl: string = "https://brigadistacivil.com.br";
}
