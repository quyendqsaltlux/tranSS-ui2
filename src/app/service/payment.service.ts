import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {
  }

  save(param: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH, param, {observe: 'response'});
  }

}
