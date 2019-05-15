import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {PrincipleService} from '../service/principle.service';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private principleService: PrincipleService,
              public route: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        switch (err.status) {
          case 0:
            this.principleService.logout();
            this.route.navigate(['/server-off']);
            break;
          case 401:
            this.principleService.logout();
            this.route.navigate(['/access-deny']);
            break;
        }
        return throwError(err);
      })
    );
  }
}
