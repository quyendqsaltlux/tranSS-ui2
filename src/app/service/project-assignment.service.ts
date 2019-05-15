import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/projectAssignment';

@Injectable({
  providedIn: 'root'
})
export class ProjectAssignmentService {

  constructor(private http: HttpClient) {
  }

  create(projectAssignment: any): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH, projectAssignment, {observe: 'response'});
  }

  getListByProject(projectId: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/search/' + projectId, {observe: 'response'});
  }

  changeStatus(id: any, status): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/changeStatus/' + id + '/' + status, {observe: 'response'});
  }

  changeProgress(id: any, progress): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/changeProgress/' + id + '/' + progress, {observe: 'response'});
  }

  review(id: any, comment: string = null, star: number): Observable<HttpResponse<any>> {
    const params = '?star=' + star;
    return this.http.post<HttpResponse<any>>(API_PATH + '/review/' + id + params, comment, {observe: 'response'});
  }
}
