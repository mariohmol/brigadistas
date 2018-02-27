import { Injectable } from '@angular/core';

@Injectable()
export default class Environment {
  public static env = 'production';
  public static apiBase = 'https://brigadistacivil.com.br/api';
  public static baseUrl = 'https://brigadistacivil.com.br';
}
