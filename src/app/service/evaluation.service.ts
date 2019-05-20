import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {buildPathParams} from "../util/http-util";

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

  searchSpecificComment(page, size, keyWord, orderBy, sortDirection, filters = [], pmFilters, candidateId: number): Observable<HttpResponse<any>> {
    let path = buildPathParams(page, size, keyWord, orderBy, sortDirection);
    path = path + '&candidateId=' + candidateId;
    const params = {
      rootFilters: filters,
      joinFilters: pmFilters
    };
    return this.http.post<HttpResponse<any>>(API_PATH + '/specific/search/' + candidateId + '/' + path, params, {observe: 'response'});
  }

  saveGeneralComment(param: any, candidateId): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH + '/general/' + candidateId, param, {observe: 'response'});
  }

  findGeneralCommentById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/general/' + id, {observe: 'response'});
  }

  searchGeneralComment(page, size, keyWord, orderBy, sortDirection, filters = [], pmFilters, candidateId: number): Observable<HttpResponse<any>> {
    let path = buildPathParams(page, size, keyWord, orderBy, sortDirection);
    path = path + '&candidateId=' + candidateId;
    const params = {
      rootFilters: filters,
      joinFilters: pmFilters
    };
    return this.http.post<HttpResponse<any>>(API_PATH + '/general/search/' + candidateId + '/' + path, params, {observe: 'response'});
  }
}
