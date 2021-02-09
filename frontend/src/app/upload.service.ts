import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  SERVER_URL: string = 'http://localhost:5000';


  constructor(private http: HttpClient) {
  }

  public upload(formData) {
    return this.http.post<any>(this.SERVER_URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // postFile(fileToUpload: File): Observable<boolean> {
  //   const endpoint = 'your-destination-url';
  //   const formData: FormData = new FormData();
  //   formData.append('fileKey', fileToUpload, fileToUpload.name);
  //   return this.http
  //     .post(endpoint, formData, {headers: null})
  //     .map(() => {
  //       return true;
  //     })
  //     .catch((e) => this.handleError(e));
  // }


  postFile(fileToUpload: File) {
    const endpoint = this.SERVER_URL + '/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(endpoint, formData, {headers: null});
    // .map(() => { return true; })
    // .catch((e) => this.handleError(e));
  }


  submitImage(currentImageFile: any): Observable<Blob> {
    let formData: FormData = new FormData();
    formData.append('file', currentImageFile, currentImageFile.name);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post(this.SERVER_URL + '/upload', formData, {headers: headers, responseType: 'blob'});
  }

  createImageFromBlob(imageBlob: Blob, targetImage, selector) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      targetImage = reader.result;
      document.querySelector(selector)['src'] = reader.result;

    }, false);

    if (imageBlob) {
      reader.readAsDataURL(imageBlob);
    }
  }
}
