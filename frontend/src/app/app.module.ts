import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FooterComponent} from './shared/footer/footer.component';
import {TopbarComponent} from './shared/topbar/topbar.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';
import {HomeComponent} from './home/home.component';
import {OneImageDetectionComponent} from './emotion-detection/one-image-detection/one-image-detection.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BatchProcessingComponent} from './emotion-detection/batch-processing/batch-processing.component';
import {WebcamModule} from 'ngx-webcam';
import {LiveDetectionComponent} from './emotion-detection/live-detection/live-detection.component';
import {NgOpenCVModule, OpenCVOptions} from 'ng-open-cv';
// import {FirefoxProfile} from 'firefox-profile';

const openCVConfig: OpenCVOptions = {
  scriptUrl: `assets/opencv/opencv.js`,
  wasmBinaryFile: 'wasm/opencv_js.wasm',
  usingWasm: true
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    HomeComponent,
    OneImageDetectionComponent,
    BatchProcessingComponent,
    LiveDetectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    WebcamModule,
    // FirefoxProfile,
    NgOpenCVModule.forRoot(openCVConfig),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
