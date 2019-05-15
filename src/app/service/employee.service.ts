import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {
  }

  findUserByUsernameLike(keyWord): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/findUserByUsernameLike?keyword=' + keyWord, {observe: 'response'});
  }

}
