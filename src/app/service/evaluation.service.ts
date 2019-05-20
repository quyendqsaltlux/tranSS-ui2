import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  constructor(private http: HttpClient) {
  }

  saveSpecificComment(param: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH + '/specific', param, {observe: 'response'});
  }

  findSpecificCommentById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/specific/' + id, {observe: 'response'});
  }

  deleteSpecificComment(id: any): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(API_PATH + '/specific/' + id, {observe: 'response'});
  }

}
