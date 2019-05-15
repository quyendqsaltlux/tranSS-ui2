import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

const API_SERVER = environment.apiUrl;
const API_PATH = API_SERVER + '/file-upload';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) {
  }

  uploadFile(cvFile: File, folder: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', cvFile);
    const params = new HttpParams();
    const options = {
      'params': params,
      'reportProgress': true,
    };
    return this.http.post<any>(API_PATH + '/upAttachment/' + folder, formData, options);
  }

  downloadFile(filePath: string): Observable<any> {
    return this.http.post<any>(API_PATH + '/getAttachment', {path: filePath},
      {responseType: 'blob' as 'json'});
  }
}
