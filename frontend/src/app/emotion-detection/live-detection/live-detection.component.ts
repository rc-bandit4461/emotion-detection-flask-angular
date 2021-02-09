import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {BehaviorSubject, forkJoin, fromEvent, Observable, Subject} from 'rxjs';
import {NgOpenCVService, OpenCVLoadResult} from 'ng-open-cv';
import {filter, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-live-detection',
  templateUrl: './live-detection.component.html',
  styleUrls: ['./live-detection.component.css']
})
export class LiveDetectionComponent implements OnInit, AfterViewInit {
  pageTitle: string = 'Live emotion detection';
// toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public streaming = false;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
    frameRate: 15
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }).finally(() => {
    });
    this.initOpenCV();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    console.log('received!');
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

//OPENCV

  // Notifies of the ready state of the classifiers load operation
  private classifiersLoaded = new BehaviorSubject<boolean>(false);
  classifiersLoaded$ = this.classifiersLoaded.asObservable();

  // HTML Element references
  @ViewChild('fileInput')
  fileInput: ElementRef;
  @ViewChild('canvasOutput2')
  canvasOutput: ElementRef;

  // Inject the NgOpenCVService
  constructor(private ngOpenCVService: NgOpenCVService, private http: HttpClient) {
  }

  initOpenCV() {
    // Always subscribe to the NgOpenCVService isReady$ observer before using a CV related function to ensure that the OpenCV has been
    // successfully loaded
    this.ngOpenCVService.isReady$
      .pipe(
        // The OpenCV library has been successfully loaded if result.ready === true
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          // Load the face and eye classifiers files
          return this.loadClassifiers();
        })
      )
      .subscribe(() => {
        // The classifiers have been succesfully loaded
        this.classifiersLoaded.next(true);
      });
  }

  ngAfterViewInit(): void {
    // Here we just load our example image to the canvas
    this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        tap((result: OpenCVLoadResult) => {
          // this.ngOpenCVService.loadImageToHTMLCanvas(this.imageUrl, this.canvasInput.nativeElement).subscribe();
        })
      )
      .subscribe(() => {
      });
  }

  // Before attempting face detection, we need to load the appropriate classifiers in memory first
  // by using the createFileFromUrl(path, url) function, which takes two parameters
  // @path: The path you will later use in the detectMultiScale function call
  // @url: The url where to retrieve the file from.
  loadClassifiers(): Observable<any> {
    return forkJoin(
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_frontalface_default.xml',
        `assets/opencv/data/haarcascades/haarcascade_frontalface_default.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_eye.xml',
        `assets/opencv/data/haarcascades/haarcascade_eye.xml`
      )
    );
  }


  clearOutputCanvas() {
    const context = this.canvasOutput.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.canvasOutput.nativeElement.width, this.canvasOutput.nativeElement.height);
  }



  findFaceAndEyes2(src, output) {
    // Example code from OpenCV.js to perform face and eyes detection
    // Slight adapted for Angular
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    const faces = new cv.RectVector();
    const eyes = new cv.RectVector();
    const faceCascade = new cv.CascadeClassifier();
    const eyeCascade = new cv.CascadeClassifier();
    // load pre-trained classifiers, they should be in memory now
    faceCascade.load('haarcascade_frontalface_default.xml');
    eyeCascade.load('haarcascade_eye.xml');
    // detect faces
    const msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
    for (let i = 0; i < faces.size(); ++i) {
      const roiGray = gray.roi(faces.get(i));
      const roiSrc = src.roi(faces.get(i));
      const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      const point2 = new cv.Point(faces.get(i).x + faces.get(i).width, faces.get(i).y + faces.get(i).height);
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      // detect eyes in face ROI
      eyeCascade.detectMultiScale(roiGray, eyes);
      for (let j = 0; j < eyes.size(); ++j) {
        const point3 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
        const point4 = new cv.Point(eyes.get(j).x + eyes.get(j).width, eyes.get(j).y + eyes.get(j).height);
        cv.rectangle(roiSrc, point3, point4, [0, 0, 255, 255]);
      }
      roiGray.delete();
      roiSrc.delete();
    }
    cv.imshow(output, src);
    src.delete();
    gray.delete();
    faceCascade.delete();
    eyeCascade.delete();
    faces.delete();
    eyes.delete();
  }

  async test4() {
    const faceCascade = new cv.CascadeClassifier();
    const eyeCascade = new cv.CascadeClassifier();
    // load pre-trained classifiers, they should be in memory now
    faceCascade.load('haarcascade_frontalface_default.xml');
    eyeCascade.load('haarcascade_eye.xml');
    let video: any = document.getElementById('videoInput'); // video is the id of video tag
    video.width = 640;
    video.height = 480;
    video.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    video.play();
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);

    const FPS = 5;
    const component = this;
    let called = false;

    function processVideo() {
      try {

        let begin = Date.now();
        // start processing.
        cap.read(src);
        // console.log(src);

        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        const faces = new cv.RectVector();

        const msize = new cv.Size(0, 0);
        faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
        for (let i = 0; i < faces.size(); ++i) {
          const roiGray = gray.roi(faces.get(i));
          // console.log(faces.get(i));
          const roiSrc = src.roi(faces.get(i));
          // @ts-ignore
          console.log(btoa(roiSrc['data']));
          if (!called) {
          component.http.post('http://localhost:5000/matrix', {'data': roiSrc.data, 'OK': 'OK'}, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).subscribe(value => {
            called = true;
            console.log('SENT');
            console.log(value);
          }, error => {
            called = true;
            console.log(error);
          });
        }
          const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
          const point2 = new cv.Point(faces.get(i).x + faces.get(i).width, faces.get(i).y + faces.get(i).height);
          cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
          roiGray.delete();
          roiSrc.delete();
        }

        cv.imshow('canvasOutput', src);
        let canvas = document.getElementById('canvasOutput');
        // @ts-ignore
        let ctx = canvas.getContext('2d');
        let image = document.getElementById('source');

        ctx.fillRect(10, 10, 10, 10);
        ctx.fillRect(30, 10, 10, 10);
        // @ts-ignore
        const data = canvas.toDataURL();


        // console.log('base64', data);
        // src.delete();
        // gray.delete();
        // faceCascade.delete();
        faces.delete();
        // eyes.delete();


        // schedule the next one.
        // let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, 5000);
      } catch (err) {
        console.error(err);
      }
    }

    // schedule the first one.
    setTimeout(processVideo, 0);


  }
}
