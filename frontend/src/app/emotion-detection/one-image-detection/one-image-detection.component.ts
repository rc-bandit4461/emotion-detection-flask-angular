import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UploadService} from '../../upload.service';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {FormBuilder, FormGroup, NgModel} from '@angular/forms';

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


    public currentImage:string='';
    public currentImageFile:any;
    public message:string='';
    public detectionForm: FormGroup;


  constructor(private uploadService: UploadService,private http:HttpClient, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.detectionForm = this.formBuilder.group({

    });
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
      console.error(error);
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










  onFileChange(event:any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.currentImage = reader.result as string;
        this.currentImageFile = file;
        this.message = '';
        console.log(this.currentImageFile);
      };
    }
    else{
      this.currentImageFile = null;
      this.currentImage = '';
    }
  }
  onSubmit(){
    if(this.currentImage === '' || !this.currentImageFile) {
      this.message = "Image required !!!";
      return ;
    }
    this.uploadService.submitImage(this.currentImageFile).subscribe((res)=>{
      console.log(res);
      this.message = res['data'];
    },(er)=>{
      console.error(er);
    });
  }
}
