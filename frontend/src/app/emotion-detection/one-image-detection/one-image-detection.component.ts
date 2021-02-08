import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UploadService} from '../../upload.service';
import {HttpClient, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-one-image-detection',
  templateUrl: './one-image-detection.component.html',
  styleUrls: ['./one-image-detection.component.css']
})
export class OneImageDetectionComponent implements OnInit {
  pageTitle: string = 'Simple One Image Detection';
  fileToUpload: File = null;

  @ViewChild('fileUpload', {static: false})
  fileUpload: ElementRef;
  files = [];

  constructor(private uploadService: UploadService,private http:HttpClient) {
  }

  ngOnInit(): void {
  }

  // uploadFile(file: any) {
  //   const formData = new FormData();
  //   formData.append('file', file.data);
  //   file.inProgress = true;
  //   this.uploadService.upload(formData).pipe(
  //     map(event => {
  //       switch (event.type) {
  //         case HttpEventType.UploadProgress:
  //           file.progress = Math.round(event.loaded * 100 / event.total);
  //           break;
  //         case HttpEventType.Response:
  //           return event;
  //       }
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       file.inProgress = false;
  //       return of(`Upload failed: ${file.data.name}`);
  //     })).subscribe((event: any) => {
  //     if (typeof (event) === 'object') {
  //       console.log(event.body);
  //     }
  //   });
  // }


  testCors(){
    this.http.get(this.uploadService.SERVER_URL + "/api/test").subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(typeof files.item(0));
  }

  uploadFileToActivity() {
    this.uploadService.postFile(this.fileToUpload).subscribe(value => {
      console.log("success");
      console.log(value);
    }, error => {
      console.log("error");
      console.log(error);
    })
  }

  // onClick() {
  //   const fileUpload = this.fileUpload.nativeElement;
  //   console.log(fileUpload);
  //   fileUpload.onchange = () => {
  //     for (let index = 0; index < fileUpload.files.length; index++) {
  //       const file = fileUpload.files[index];
  //       this.files.push({data: file, inProgress: false, progress: 0});
  //     }
  //     // this.uploadFile();
  //   };
  //   // fileUpload.click();
  // }

  onChangeFile($event: Event) {
    console.log($event);
    console.log(this.fileUpload);
    console.log(this.files);
  }

  onSubmitFile() {

  }

  log(fileUpload: NgModel) {
    console.log(fileUpload);
  }
}
