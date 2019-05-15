import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';const API_SERVER = environment.apiUrl;
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

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

}
