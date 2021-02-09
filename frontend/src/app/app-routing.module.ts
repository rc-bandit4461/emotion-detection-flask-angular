import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {OneImageDetectionComponent} from './emotion-detection/one-image-detection/one-image-detection.component';
import {LiveDetectionComponent} from './emotion-detection/live-detection/live-detection.component';

const routes: Routes = [
   {
    path: '',
    component: HomeComponent
  },
    {
    path: 'live-detection',
    component: LiveDetectionComponent
  },
  {
    path: 'one-image-detection',
    component: OneImageDetectionComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
