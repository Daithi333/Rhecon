import { Injectable } from '@angular/core';

import { Request } from './request.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private requestList: Request[] = [
    new Request(
      1001,
      'Recurring migranes',
      this.authService.userId,
      4,
      2,
      'Patient Jane has visited on a number of occasions complaining of migranes',
      true,
      new Date('2019-05-20'),
      new Date('2019-05-22')
    ),
    new Request(
      1002,
      'Unknown skin condition',
      this.authService.userId,
      2,
      1,
      'Looks like an allergic reaction, but no obvious trigger. Would you agree?',
      true,
      new Date('2019-05-20'),
      new Date('2019-05-22')
    ),
    new Request(
      1003,
      'Joe Bloggs suspected Malaria',
      this.authService.userId,
      4,
      3,
      'Please confirm if these symptoms look like Malaria',
      false,
      new Date('2019-05-18'),
      new Date('2019-05-21')
    ),
    new Request(
      1004,
      'CT scan analysis',
      this.authService.userId,
      3,
      4,
      'We were able to take a CT scan but need some consultation on the diagnosis',
      false,
      new Date('2019-05-18'),
      new Date('2019-05-21')
    )
  ];

  constructor(private authService: AuthService) {}

  get activeRequests() {
    return [...this.requestList];
    // return [...this.requestList.filter(request => request.requestActive === true)];
  }

  get inactiveRequests() {
    return [...this.requestList];
    // return [...this.requestList.filter(request => request.requestActive === false)];
  }

  getRequest(id: number) {
    return { ...this.requestList.find(request => request.id === id) };
  }
}
