import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {buildPathParams} from '../util/http-util';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/resource-test-waiting';

@Injectable({
  providedIn: 'root'
})
export class TestWaitingService {

  constructor(private http: HttpClient) {
  }

  create(model: any): Observable<HttpResponse<any>> {
    model.isShortList = model.isShortList ? 1 : 0;
    return this.http.post<HttpResponse<any>>(API_PATH, model, {observe: 'response'});
  }

  search(page, size, keyWord, orderBy, sortDirection, filters = []): Observable<HttpResponse<any>> {
    const path = buildPathParams(page, size, keyWord, orderBy, sortDirection);
    const params = {
      rootFilters: filters,
      joinFilters: []
    };
    return this.http.post<HttpResponse<any>>(API_PATH + '/search/' + path, params, {observe: 'response'});
  }

  deleteById(id: any): Observable<any> {
    return this.http.delete(API_PATH + '/' + id, {observe: 'response'});
  }

  findById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/findById/' + id, {observe: 'response'});
  }
}
