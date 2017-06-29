import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage, TrackInfo } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundGeolocation } from "@ionic-native/background-geolocation";
import { File } from '@ionic-native/file';
import { PopoverPage } from "../pages/popover/popover";
import { BackgroundGeolocationMock } from "../mocks";



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    PopoverPage


  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    PopoverPage
  ],
  providers: [
    StatusBar, 
     BackgroundGeolocation,
    SplashScreen, TrackInfo, File,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
   // { provide: BackgroundGeolocation, useClass: BackgroundGeolocationMock }
  ]
})
export class AppModule { }
