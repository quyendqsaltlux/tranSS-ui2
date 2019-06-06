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

  getDefaultInvoice(_company, _candidateCode?, _externalResourceName?): Observable<HttpResponse<any>> {
    const params = {
      resourceCode: _candidateCode || null,
      externalResourceName: _externalResourceName || null,
      company: _company
    };
    return this.http.post<HttpResponse<any>>(API_PATH + '/getDefaultInvoice', params, {observe: 'response'});
  }

  create(invoiceReq: any, candidateCode?, _externalResourceName?): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH + '/save/' + candidateCode + '/' + _externalResourceName, invoiceReq, {observe: 'response'});
  }

  findById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/findById/' + id, {observe: 'response'});
  }

  download(poId): Observable<any> {
    return this.http.post<any>(API_PATH + '/exportInvoice/' + poId, null, {responseType: 'blob' as 'json'});
  }

  search(_candidateCode?, _externalResourceName?): Observable<HttpResponse<any>> {
    const params = {
      resourceCode: _candidateCode || null,
      externalResourceName: _externalResourceName || null
    };
    return this.http.post<HttpResponse<any>>(API_PATH + '/scanPos', params,
      {observe: 'response'});
  }

  getInvoicesByStatus(isConfirmed: boolean): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(API_PATH + '/getNotConfirmedInvoices/?isConfirmed=' + isConfirmed,
      {observe: 'response'});
  }

  markConfirm(id, _value): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(API_PATH + '/markConfirm/' + id, {value: _value},
      {observe: 'response'});
  }

  deleteById(id: any): Observable<HttpResponse<any>> {
    return this.http.delete(API_PATH + '/' + id, {observe: 'response'});
  }

  generateInvoices() {
    return this.http.get<HttpResponse<any>>(API_PATH + '/generateInvoices', {observe: 'response'});
  }
}
