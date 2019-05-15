import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(principle: any): Observable<HttpResponse<any>> {
    const url = API_PATH + '/signin';
    console.log(url);
    return this.http.post<HttpResponse<any>>(url, principle, {observe: 'response'});
  }

}
