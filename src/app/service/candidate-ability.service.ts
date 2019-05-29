import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {buildPathParams} from "../util/http-util";
import {SortParam} from "../model/SortParam";

const API_SERVER = environment.apiUrl;

const API_PATH = API_SERVER + '/candidateAbilities';

@Injectable({
  providedIn: 'root'
})
export class CandidateAbilityService {

  constructor(private http: HttpClient) {
  }

  save(ability: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH, ability, {observe: 'response'});
  }

  getList(candidateId): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/listAll/' + candidateId, {observe: 'response'});
  }

  delete(id): Observable<HttpResponse<any>> {
    return this.http.delete(API_PATH + '/' + id, {observe: 'response'});
  }

  search(page, size, keyWord, _sorts: SortParam[], filters = [], joinFilter = []): Observable<HttpResponse<any>> {
    const path = buildPathParams(page, size, keyWord);
    const params = {
      sorts: _sorts,
      filter: {
        rootFilters: filters,
        joinFilters: joinFilter
      }
    };

    return this.http.post<HttpResponse<any>>(API_PATH + '/search' + path, params, {observe: 'response'});
  }
}
