import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getInfo(username: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/permission/' + username, {observe: 'response'});
  }
}
