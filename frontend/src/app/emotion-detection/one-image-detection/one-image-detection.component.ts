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
  predictedImage: any = null

  public currentImage: string = '';
  public currentImageFile: any;
  public message: string = '';
  public detectionForm: FormGroup;
  public isImageLoading: boolean = false;


  constructor(private uploadService: UploadService, private http: HttpClient, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.detectionForm = this.formBuilder.group({});
  }

  predictedImageSelector: string = 'predicted_image';


  testCors() {
    this.http.get(this.uploadService.SERVER_URL + '/api/test').subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }


  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.currentImage = reader.result as string;
        this.currentImageFile = file;
        this.message = '';
        console.log(this.currentImageFile);
      };
    } else {
      this.currentImageFile = null;
      this.currentImage = '';
    }
  }

  onSubmit() {
    if (this.currentImage === '' || !this.currentImageFile) {
      this.message = 'Image required !!!';
      return;
    }
    this.isImageLoading = true;
    this.uploadService.submitImage(this.currentImageFile).subscribe((res) => {
      console.log("OK");
      this.isImageLoading = false;
      this.uploadService.createImageFromBlob(res, this.predictedImage, '#' + this.predictedImageSelector);
      console.log(res);
      // this.message = res['data'];
    }, (er) => {
      console.log("OK no");
      this.isImageLoading = false;
      console.error(er);
    });
  }

}
