import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface TitleData {
  id: number;
  title: string;
}

export interface SpecialismData {
  id: number;
  specialism: string;
}

export interface UserTypeData {
  id: number;
  userType: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  fetchTitles() {
    return this.httpClient.get<{[key: number]: TitleData}>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/title/read.php'
    ).pipe(
      map(resData => {
        const titles: TitleData[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            titles.push({
              id: +resData[key].id,
              title: resData[key].title
            });
          }
        }
        return titles;
      })
    );
  }

  fetchSpecialisms() {
    return this.httpClient.get<{[key: number]: SpecialismData}>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/specialism/read.php'
    ).pipe(
      map(resData => {
        const specialisms: SpecialismData[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            specialisms.push({
              id: +resData[key].id,
              specialism: resData[key].specialism
            });
          }
        }
        return specialisms;
      })
    );
  }

  fetchUserTypes() {
    return this.httpClient.get<{[key: number]: UserTypeData}>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/user-type/read.php'
    )
    .pipe(
      map(resData => {
        const userTypes: UserTypeData[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            userTypes.push({
              id: +resData[key].id,
              userType: resData[key].userType
            });
          }
        }
        return userTypes;
      })
    );
  }
}
