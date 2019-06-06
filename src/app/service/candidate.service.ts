import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {buildPathParams} from '../util/http-util';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/candidate';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient) {
  }

  create(candidate: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH, candidate, {observe: 'response'});
  }

  downloadCv(filePath: string): Observable<any> {
    return this.http.post<any>(API_PATH + '/getCv', {path: filePath},
      {responseType: 'blob' as 'json'});
  }

  downloadDiploma(filePath: string): Observable<any> {
    return this.http.post<any>(API_PATH + '/getDiploma', {path: filePath},
      {responseType: 'blob' as 'json'});
  }

  downloadAttachment(filePath: string): Observable<any> {
    return this.http.post<any>(API_PATH + '/getAttachment', {path: filePath},
      {responseType: 'blob' as 'json'});
  }

  search(page, size, keyWord, orderBy, sortDirection, filters = [], abilityFilters = []): Observable<HttpResponse<any>> {
    const path = buildPathParams(page, size, keyWord, orderBy, sortDirection);
    const params = {
      rootFilters: filters,
      joinFilters: abilityFilters,
    };

    return this.http.post<HttpResponse<any>>(API_PATH + '/search' + path, params, {observe: 'response'});
  }

  findById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/findById/' + id, {observe: 'response'});
  }

  deleteById(id: any): Observable<any> {
    return this.http.delete(API_PATH + '/' + id, {observe: 'response'});
  }

  findResourceForProject(code: string): Observable<HttpResponse<any>> {
    const params = 'keyword=' + code ;
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/findCandidateByCodeOrNameLike?' + params,
      {observe: 'response'});
  }
}
