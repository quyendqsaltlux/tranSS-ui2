import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

const API_SERVER = environment.apiUrl;
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {buildPathParams} from "../util/http-util";

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

  search(page, size, keyWord, orderBy, sortDirection, filters = [], joinFilter = []): Observable<HttpResponse<any>> {
    const path = buildPathParams(page, size, keyWord, orderBy, sortDirection);
    const params = {
      rootFilters: filters,
      joinFilters: joinFilter
    };

    return this.http.post<HttpResponse<any>>(API_PATH + '/search' + path, params, {observe: 'response'});
  }
}
