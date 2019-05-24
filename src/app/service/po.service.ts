import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/purchaseOrder';

@Injectable({
  providedIn: 'root'
})
export class PoService {

  constructor(private http: HttpClient) {
  }

  getDefaultPo(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/getDefaultPo/' + id, {observe: 'response'});
  }

  create(po: any, assignmentId): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH + '/save/' + assignmentId, po, {observe: 'response'});
  }

  findById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/findById/' + id, {observe: 'response'});
  }
}
