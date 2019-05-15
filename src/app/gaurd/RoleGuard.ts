import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route} from '@angular/router';
import {Observable} from 'rxjs';
import {PrincipleService} from '../service/principle.service';
import {hasRole} from '../util/string-util';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private principleService: PrincipleService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.principleService.getUserInfo();
    const roles = next.data.roles;
    if (!roles || roles.length === 0) {
      return true;
    }

    if (hasRole(roles, user.roles)) {
      return true;
    }

    // navigate to not found page
    this._router.navigate(['/access-deny']);
    return false;
  }

}
