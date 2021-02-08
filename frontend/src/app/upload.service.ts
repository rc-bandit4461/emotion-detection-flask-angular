import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  SERVER_URL: string = 'http://localhost:5000';

  constructor(private httpClient: HttpClient) {
  }

  public upload(formData) {
    return this.httpClient.post<any>(this.SERVER_URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // postFile(fileToUpload: File): Observable<boolean> {
  //   const endpoint = 'your-destination-url';
  //   const formData: FormData = new FormData();
  //   formData.append('fileKey', fileToUpload, fileToUpload.name);
  //   return this.httpClient
  //     .post(endpoint, formData, {headers: null})
  //     .map(() => {
  //       return true;
  //     })
  //     .catch((e) => this.handleError(e));
  // }
 postFile(fileToUpload: File) {
    const endpoint = this.SERVER_URL + "/upload"
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData, { headers: null });
      // .map(() => { return true; })
      // .catch((e) => this.handleError(e));
}
}
