import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface TitleData {
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  fetchTitles() {
    return this.httpClient.get<{[key: number]: TitleData}>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/title/read.php'
    );
  }
}
