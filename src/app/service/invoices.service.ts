import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/invoices';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  constructor(private http: HttpClient) {
  }

  getDefaultInvoice(candidateCode: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/getDefaultInvoice/' + candidateCode, {observe: 'response'});
  }

  create(invoiceReq: any, candidateCode): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH + '/save/' + candidateCode, invoiceReq, {observe: 'response'});
  }

  findById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/findById/' + id, {observe: 'response'});
  }

  downloadPO(poId): Observable<any> {
    return this.http.post<any>(API_PATH + '/exportPo/' + poId, null, {responseType: 'blob' as 'json'});
  }

  search(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/scanPos',
      {observe: 'response'});
  }

  getNotConfirmedInvoices(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/getNotConfirmedInvoices',
      {observe: 'response'});
  }

  deleteById(id: any): Observable<HttpResponse<any>> {
    return this.http.delete(API_PATH + '/' + id, {observe: 'response'});
  }

  generateInvoices() {
    return this.http.get<HttpResponse<any>>(API_PATH + '/generateInvoices', {observe: 'response'});
  }
}
