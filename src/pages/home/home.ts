import { Component, NgZone } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import {
    BackgroundGeolocation, BackgroundGeolocationConfig,
    BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation';
//import * as xml2json from 'xml2json';
import { File } from '@ionic-native/file';
import * as xml2js from "xml2js";
import * as xmlbuilder from "xmlbuilder";
import { PopoverPage } from "../popover/popover";

const config_distance: BackgroundGeolocationConfig = {
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: true, // enable this to clear background location settings
    // when the app terminates
    // Android only section
    //  Possible values: ANDROID_DISTANCE_FILTER_PROVIDER: 0,
    // ANDROID_ACTIVITY_PROVIDER: 1
    locationProvider: 0,
    interval: 40000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
    notificationTitle: 'Background tracking',
    notificationText: 'enabled',
    notificationIconColor: '#FEDD1E',
};
const config_activity: BackgroundGeolocationConfig = {
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: true, // enable this to clear background location settings
    // when the app terminates
    // Android only section
    //  Possible values: ANDROID_DISTANCE_FILTER_PROVIDER: 0,
    // ANDROID_ACTIVITY_PROVIDER: 1
    locationProvider: 1,
    interval: 40000,
    fastestInterval: 4000,
    activitiesInterval: 10000,
    notificationTitle: 'Background tracking',
    notificationText: 'enabled',
    notificationIconColor: '#FEDD1E',
};


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    provider: any;
    ascentStr: string;
    descentStr: string;
    altitude: string;
    ascent: number = 0;
    descent: number = 0;
    lastAltitude: any;
    lastLng: any;
    lastLat: any = 0;
    loopLocations: number;
    kmPerHour: any;
    startTimeStamp: any;
    stopTime: any;
    bearing: any;

    speed: any = 0;
    latitude: any;
    longitude: any;
    startTime: string;
    duration: any = 0;
    distance: number = 0;
    distanceString: string = ' 0';
    arrayPointer: any;
    forXml: BackgroundGeolocationResponse[] = [];
    timeOffset: any = (new Date().getTimezoneOffset() * -1) / 60;
    flag: number = 0;
    locations: { flag: number, geoResponse: BackgroundGeolocationResponse }[] = [];
    trackInfos: TrackInfo[] = [];
    constructor(public navCtrl: NavController, public zone: NgZone,
        private backgroundGeolocation: BackgroundGeolocation,
        private file: File, public popoverCtrl: PopoverController) {

        this.reset();
        this.backgroundGeolocation.configure(config_activity)
            .subscribe((location: BackgroundGeolocationResponse) => {
                this.zone.run(() => {
                    this.locations.push({ flag: this.flag, geoResponse: location });
                    this.forXml.push(location);
                    console.log('accuracy ' + location.accuracy)
                    if (location.locationProvider == 0) {
                        this.provider = 'DISTANCE_FILTER_PROVIDER';
                    } else {
                        this.provider = 'ACTIVITY_PROVIDER';
                    }
                    this.latitude = location.latitude.toFixed(6);
                    this.longitude = location.longitude.toFixed(6);
                    this.speed = (location.speed * 3.6).toFixed(1) || 0;
                    this.altitude = (location.altitude).toFixed(1) || '0';
                    this.bearing = location.bearing || 0;
                    if (this.lastLat != 0) {
                        this.distance +=
                            this.distanceInKmBetweenEarthCoordinates(this.lastLat, this.lastLng,
                                location.latitude, location.longitude);
                        this.distanceString = this.distance.toFixed(2).toString();
                        if (this.lastAltitude > (location.altitude).toFixed(1)) {
                            // ereszkedés
                            this.descent += this.lastAltitude - (location.altitude);
                            this.descentStr = this.descent.toFixed(1).toString();
                        } else {
                            //  emelkedés
                            this.ascent += (location.altitude) - this.lastAltitude;
                            this.ascentStr = this.ascent.toFixed(1).toString();
                        }
                        let stop = new Date().getTime();
                        this.duration =
                            this.timeDiffHelper(this.startTimeStamp, stop).substring(0, 5);

                        this.kmPerHour =
                            this.getSpeed(this.duration, this.distance).toFixed(1).toString();
                    }
                    this.lastLat = location.latitude;
                    this.lastLng = location.longitude;
                    this.lastAltitude = this.altitude;
                });

            }, error => {
                console.log('subscribe for georesponse: ' + error);
            });


    }
    presentPopover(myEvent) {
        let opts = {
            cssClass: '',

        }
        let popover = this.popoverCtrl.create(PopoverPage, { name: 'e' }, opts);
        popover.present({
            ev: myEvent
        });
    }




    bearingHelper(bearing: any): any {
        let d = '';
        let b;
        let result = 'nan';
        let options: any[] = [{ name: 'N', low: 0, high: 22 }, { name: 'NE', low: 23, high: 62 },
        { name: 'E', low: 63, high: 112 }, { name: 'SE', low: 113, high: 152 },
        { name: 'S', low: 153, high: 202 }, { name: 'SW', low: 203, high: 248 },
        { name: 'W', low: 249, high: 293 }, { name: 'NW', low: 294, high: 338 },
        { name: 'N', low: 339, high: 359 }];
        if (typeof bearing == 'number') {
            b = Math.round(bearing);
            options.map(e => workout(e));
        } else {

        }
        function workout(item) {
            if (item.low <= b && item.high >= b) {
                console.log(item.name)
                result = name;


            }
        }
        return result;
    }

    writeFile() {
        let d = new Date();
        let fileName = '' + d.getFullYear() + (d.getMonth() + 1) +
            (d.getDate() + 1) + '-' + (d.getHours() + 1) + (d.getMinutes() + 1);

        let path = 'file:///storage/emulated/0/Android/data/io.ionic.tracker_mauron85/./mydir/';
        let path2 = './mydir/';
        // this.file.createDir(this.file.externalApplicationStorageDirectory, 'mydir', false).then(_ => {
        //     console.log('oké')
        // });
        let content = this.buildGPXObj();

        this.file.writeFile(path, 'first.gpx', content, { replace: true }).then(res => {
            console.log('write ok')
        }).catch(err => console.log('write err : ' + err));

        this.file.readAsText(path, 'first.gpx').then(res => {
            console.log('read ok ' + res)
        }).catch(err => console.log('read error ' + err));

        // WriteOptions interface is this:
        // export interface WriteOptions {
        //     create?: boolean;
        //     replace?: boolean;
        //     append?: boolean;
        //     truncate?: number;
        // }

    }


    buildGPXObj() {

        var root = xmlbuilder.create('gpx', { encoding: 'utf-8' });
        var trk = root.ele('trk');
        var item = trk.ele('trkseg');

        this.forXml.forEach(elem => {
            let w = item.ele('trkpt');
            w.att('latitude', elem.latitude);
            w.att('longitude', elem.longitude);
            w.ele('ele', elem.altitude);
            w.ele('time', elem.time);

        })
        item.up();
        trk.up();

        console.log(root.end({ pretty: true }))
        return root.end({ pretty: true });
    }

    xml2json() {

        //   https://www.npmjs.com/package/xml2js

        var obj = { name: "Super", Surname: "Man", age: 23 };

        var builder = new xml2js.Builder({ rootName: 'gpx', cdata: true });
        var xml = builder.buildObject(obj);
        console.log(xml)
        return xml;
        // <?xml version= "1.0" encoding= "UTF-8" standalone= "yes" ?>
        //     <root>
        //          <name>Super < /name>
        //          < Surname > Man < /Surname>
        //          < age > 23 < /age>
        //     < /root> 


    }


    start() {


        this.startTimeStamp = new Date().getTime();

        this.startTime = this.getFormatedTime(this.startTimeStamp,
            this.timeOffset).substring(0, 5);
        // this.startTimeStamp = startTimeStamp.getTime();
        // console.log(this.startTime)
        // console.log(this.startTimeStamp)
        this.backgroundGeolocation.isLocationEnabled().then(enabled => {
            if (enabled) {
                ++this.flag;
                this.backgroundGeolocation.start();

            } else {
                // Location services are disabled
                if (window.confirm('Location is disabled'
                    + ' Would you like to open location settings?')) {
                    this.backgroundGeolocation.showLocationSettings();
                }
            }
        });

    }


    processing() {

        // this.locations.map(e => {

        // });
        // let summerize = function (element): TrackInfo {
        //     let info = new TrackInfo();
        //     info.name

        //     return info;
        // }



    }

    work(arr: any[]) {
        let lat = 0;
        let lng = 0;
        this.distance = 0;
        let minIndex = -1;
        let bool = true;
        for (let i = 0; i < arr.length - 1; i++) {
            if (this.startTimeStamp < arr[i].time + 1000 * 60 * 60 * this.timeOffset) {
                console.log('dgdgab ag')
                this.distance +=
                    this.distanceInKmBetweenEarthCoordinates(arr[i].latitude, arr[i].longitude,
                        arr[i + 1].latitude, arr[i + 1].longitude);
            }

        }
        this.distanceString = this.distance.toFixed(1).toString();
        //  console.log('this.distanceString ' + this.distanceString)

        this.duration = this.timeDiffHelper(this.startTimeStamp, this.stopTime).substring(0, 5);

        this.kmPerHour = this.getSpeed(this.duration, this.distance).toFixed(1).toString();



    }
    reset() {
        this.startTime = '00:00';
        this.distance = 0;
        this.kmPerHour = 0;
        this.duration = '00:00';
        this.distanceString = '0'
        // this.backgroundGeolocation.deleteAllLocations().then(res => {
        //     console.log('delteAllLocations: ' + res)
        // })
        this.lastAltitude = 0;
        this.lastLat = 0;
        this.lastLng = 0;
        this.speed = 0;
        this.latitude = 0;
        this.longitude = 0;
        this.ascent = 0;
        this.descent = 0;
        this.ascentStr = '';
        this.descentStr = '';
        this.bearing = 0;
        this.altitude = '0';
        this.arrayPointer = 0;
        this.forXml = [];
       
        this.flag = 0;
        this.locations = [];
        this.trackInfos = [];
    }
    stop() {
        this.stopTime = new Date().getTime();

        this.backgroundGeolocation.getLocations().then(locations => {
            console.log(locations)
            if (locations.length >= 2) {
                //  this.work(locations);
            }
            this.backgroundGeolocation.stop();
        });


        //  this.writeFile();


    }


    dateDiffHelper_1(datepart, fromdate, todate) {
        // datepart: 'y', 'month', 'w', 'd', 'h', 'm', 's'
        datepart = datepart.toLowerCase();
        var diff = todate - fromdate;
        var divideBy = {
            w: 604800000,
            d: 86400000,  // 24*60*60*1000
            h: 3600000,   // 60*60*1000
            m: 60000,     // 60*1000
            s: 1000
        };

        return Math.floor(diff / divideBy[datepart]);
    }
    timeDiffHelper(fromdate, todate) {

        // Calculate the difference in milliseconds
        var difference_ms = todate - fromdate;
        //take out milliseconds
        difference_ms = difference_ms / 1000;
        var seconds = Math.floor(difference_ms % 60);
        let sec = this.addPlusNull(seconds.toString());
        difference_ms = difference_ms / 60;
        var minutes = Math.floor(difference_ms % 60);
        let min = this.addPlusNull(minutes.toString());
        difference_ms = difference_ms / 60;
        var hours = Math.floor(difference_ms % 24);
        let hour = this.addPlusNull(hours.toString());

        //  var days = Math.floor(difference_ms / 24);

        return hour + ':' + min + ':' + sec;

    }
    dateDiffHelper_2(fromdate, todate) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = fromdate.getTime();
        var date2_ms = todate.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        //take out milliseconds
        difference_ms = difference_ms / 1000;
        var seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        var minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        var hours = Math.floor(difference_ms % 24);
        //  var days = Math.floor(difference_ms / 24);

        return hours + ':' + minutes + ':' + seconds;

    }
    getFormatedTime(timestamp, offset) {



        let t = timestamp / 1000;
        let seconds = Math.floor(t % 60);
        let sec = this.addPlusNull(seconds.toString());
        t = t / 60;
        var minutes = Math.floor(t % 60);
        let min = this.addPlusNull(minutes.toString());

        t = t / 60;
        var hours = Math.floor(t % 24) + offset;
        let hour = this.addPlusNull(hours.toString());

        return hour + ':' + min + ':' + sec;
    }

    getSpeed(elapsedTime: string, distance: any): number {
        let h = Number(elapsedTime.substring(0, 2));
        let m = Number(elapsedTime.substring(3, 5)) / 60;
        return (distance / (h + m));
    }
    addPlusNull(str: string) {
        if (str.length == 1) {
            return '0' + str;
        } else {
            return str;
        }
    }


    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2): number {
        var earthRadiusKm = 6371;

        var dLat = this.degreesToRadians(lat2 - lat1);
        var dLon = this.degreesToRadians(lon2 - lon1);

        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Number(earthRadiusKm * c);
    }
}
export class TrackInfo {
    name: string;
    date: string;
    time: string;
    lat: number;
    lng: number;
    pictures: any[];
    duration: any;
    speed: any;
    distance: any;
}