import { Injectable } from '@angular/core';

@Injectable()
export default class Environment{
  public static env: string = "development";
}
