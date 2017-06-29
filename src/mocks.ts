


import {
    BackgroundGeolocation, BackgroundGeolocationConfig,
    BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation';

import { Observable } from "rxjs/Observable";

export class BackgroundGeolocationMock {
    public configure(options) {
        console.log('configure was called')


        let res = <BackgroundGeolocationResponse>Observable.create(observer => {
            observer.next({
                latitude: 47.505259, longitude: 19.077850, bearing: 0,
                accuracy: 10, locationProvider: 0, time: 0, altitude: 100,
                speed: 0, debug: true
            });
            observer.next({
                latitude: 47.504150, longitude: 19.075629, bearing: 0,
                accuracy: 10, locationProvider: 0, time: 0, altitude: 110,
                speed: 0, debug: true
            });
            observer.next({
                latitude: 47.501294, longitude: 19.078258, bearing: 0,
                accuracy: 10, locationProvider: 0, time: 0, altitude: 150,
                speed: 0, debug: true
            });
            observer.next({
                latitude: 47.502396, longitude: 19.080479, bearing: 0,
                accuracy: 10, locationProvider: 0, time: 0, altitude: 110,
                speed: 0, debug: true
            });
            observer.next({
                latitude: 47.505233, longitude:19.077853, bearing: 0,
                accuracy: 10, locationProvider: 0, time: 0, altitude: 100,
                speed: 0, debug: true
            });
            observer.error(new Error());
            observer.complete();
        });
        // return Observable.create(observer => {
        //     observer.next(null);
        //     observer.complete();
        // });


        return res;
    }
    public isLocationEnabled() {
        return new Promise(res => { return true; });
    }
    showLocationSettings() {

    }
    start() {

    }
    getLocations() {
        return new Promise(res => { return; });

    }
}















//import { SQLiteDatabaseConfig } from "@ionic-native/sqlite";
// declare var localStorage;
// declare var SQL;
// export class SQLiteMock {
//     public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
//         var db;
//         var storeddb;
//         console.log("Open Mock SQLite Database.");
//         var storeddb = localStorage.getItem("database");


//         if (storeddb) {
//             var arr = storeddb.split(',');
//             db = new SQL.Database(arr);
//         }
//         else {
//             db = new SQL.Database();
//         }

//         return new Promise((resolve, reject) => {
//             resolve(new SQLiteObject(db));
//         });
//     }
// }
class SQLiteObject {
    _objectInstance: any;
    constructor(_objectInstance: any) {
        this._objectInstance = _objectInstance;
    };

    executeSql(statement: string, params: any): Promise<any> {
        console.log("Mock SQLite executeSql: " + statement);

        return new Promise((resolve, reject) => {
            try {
                var st = this._objectInstance.prepare(statement, params);
                var rows: Array<any> = [];
                while (st.step()) {
                    var row = st.getAsObject();
                    rows.push(row);
                }
                var payload = {
                    rows: {
                        item: function (i) {
                            return rows[i];
                        },
                        length: rows.length
                    },
                    rowsAffected: this._objectInstance.getRowsModified() || 0,
                    insertId: this._objectInstance.insertId || void 0
                };

                //save database after each sql query 
                var arr: ArrayBuffer = this._objectInstance.export();

                localStorage.setItem("database", String(arr));
                // localStorage.set("database", JSON.stringify(arr));
                resolve(payload);
            } catch (e) {
                reject(e);
            }
        });
    };
}
