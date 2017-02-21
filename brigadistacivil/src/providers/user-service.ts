import { Injectable } from '@angular/core';
import { Http} from '@angular/http'; //RequestOptions
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';
/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService extends BaseService {
  public static loginData: any;

  constructor(public http: Http) {
    super(http);
  }

  login(username: string, password: string) {
    console.log("USER S LOGIN",UserService.loginData)
    UserService.loginData=null;
    if (UserService.loginData) {
      return Promise.resolve(UserService.loginData);
    }

    return new Promise( (resolve,reject) => {
      let data = {username: username,password: password};
        console.log("USER S LOGIN",data)
      this.doPost("/user/login",data).then(retorno => {
        if(!('error' in retorno)) UserService.loginData = retorno;
        resolve(UserService.loginData);
      }).catch( error => {
        console.log("error",error)
        reject(error);
      });
    });
  }

  logout(){
    let retorno =  this.doPost("/attrs/logout/",{});
    localStorage['profile']=null;
    localStorage.removeItem('profile');
    let deviceToken = localStorage['deviceToken']
    localStorage.clear();
    localStorage['deviceToken']=deviceToken;
    UserService.loginData=null;
    return retorno;
  }

  storeDeviceToken(type,id) {
     if(type=="android"){
  		return this.doPost("/attrs/pushregister/android/",{ androidkey: id});
  	}else {
      return this.doPost("/attrs/pushregister/ios/",{ ioskey: id});
    }
  }

  removeDeviceToken(type,id) {
     if(type=="android"){
      return this.doPost("/attrs/pushunregister/android/",{ androidkey: id});
    }else {
      return this.doPost("/attrs/pushunregister/ios/",{ ioskey: id});
    }
  }

  recuperarsenha(email) {
    return this.doPost("/attrs/recuperarsenha/"+email+"/",{});
  }

  cadastrarresidencial(data) {
    return this.doPost("/attrs/cadastrar/residencial/",data);
  }



  checkcpfvalido(cpf){
    let rev,add,i;
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf == '') return false;
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
            return false;
    // Valida 1o digito
    add = 0;
    for (i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
  }
  checkcpf(cpf) {
    return this.doPost("/attrs/cliente/checkcpf/0/"+cpf+"/",{});
  }

  checkcnpj(cnpj) {
    return this.doPost("/attrs/cliente/checkcnpj/0/${cnpj}/",{});
  }

}
