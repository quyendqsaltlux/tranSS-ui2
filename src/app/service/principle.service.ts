import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrincipleService {

  constructor() {
  }

  public setToken(token) {
    sessionStorage.setItem('token', token);
  }

  public getToken() {
    return sessionStorage.getItem('token');
  }

  public setUserInfo(userInfo) {
    const roles = userInfo.roles.map((role) => role.name);
    userInfo.roles = roles;
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  public getUserInfo() {
    return JSON.parse(sessionStorage.getItem('userInfo'));
  }

  public logout() {
    sessionStorage.removeItem('token');
  }

  hasToken(): boolean {
    const token = this.getToken();
    return token && token !== 'undefined' && token !== 'null';
  }
}
