import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FooterComponent} from './shared/footer/footer.component';
import {TopbarComponent} from './shared/topbar/topbar.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import {OneImageDetectionComponent} from './emotion-detection/one-image-detection/one-image-detection.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    HomeComponent,
    OneImageDetectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
