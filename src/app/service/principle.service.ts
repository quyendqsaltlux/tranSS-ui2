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

  public isPMLeader() {
    const user = JSON.parse(sessionStorage.getItem('userInfo'));
    const found = user.roles.findIndex((role) => role === 'ROLE_PM_LEADER');
    return found >= 0;
  }

  public isAdmin() {
    const user = JSON.parse(sessionStorage.getItem('userInfo'));
    const found = user.roles.findIndex((role) => role === 'ROLE_ADMIN');
    return found >= 0;
  }

  public logout() {
    sessionStorage.removeItem('token');
  }

  hasToken(): boolean {
    const token = this.getToken();
    return token && token !== 'undefined' && token !== 'null';
  }
}
