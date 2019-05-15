import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {buildPathParams} from '../util/http-util';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {
  }

  create(project: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH, project, {observe: 'response'});
  }

  search(page, size, keyWord, orderBy, sortDirection, filters = [], pmFilters, assignmentFilters = []): Observable<HttpResponse<any>> {
    const path = buildPathParams(page, size, keyWord, orderBy, sortDirection);
    const params = {
      rootFilters: filters,
      joinFilters: pmFilters,
      assignFilters: assignmentFilters,
    };
    return this.http.post<HttpResponse<any>>(API_PATH + '/search' + path, params, {observe: 'response'});
  }

  findById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/' + id, {observe: 'response'});
  }

  deleteById(id: any): Observable<any> {
    return this.http.delete(API_PATH + '/' + id, {observe: 'response'});
  }
}
