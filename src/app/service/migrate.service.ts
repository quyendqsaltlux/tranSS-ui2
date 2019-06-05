import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/migrate';

@Injectable({
  providedIn: 'root'
})
export class MigrateService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/getAll', {observe: 'response'});
  }

  migrateResource(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/loadCandidateFromRDB', {observe: 'response'});
  }

  migrateUser(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/loadUsersFromFile', {observe: 'response'});
  }

  migrateFinishedProject(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/loadProjectFromFile?type=FINISHED', {observe: 'response'});
  }

  migrateOngoingProject(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/loadProjectFromFile?type=ON_GOING', {observe: 'response'});
  }

  migrateKoreaPayment(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/loadKoreaPaymentFromFile', {observe: 'response'});
  }

  migrateOverseaPayment(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/loadOverseaPaymentFromFile', {observe: 'response'});
  }

  migrateAssignmentFromFile(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/loadAssignmentFromFile', {observe: 'response'});
  }

  migrateTestWaitingFromFile(): Observable<HttpResponse<any>> {
    return this.http.get<Observable<HttpResponse<any>>>(API_PATH + '/loadTestWaitingFromFile', {observe: 'response'});
  }
}
