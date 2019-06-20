import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user.model';

interface SignupResponseData {
  message: string;
  dbId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = true;
  private _userId = 5;

  get isUserAuthenticated() {
    return this.isAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor(private httpClient: HttpClient) { }

  signUp(
    titleId: number,
    firstName: string,
    lastName: string,
    userTypeId: number,
    specialismId: number,
    email: string,
    password: string
  ) {
    let uniqueId: number;
    const newUser = new User(
      null,
      titleId,
      firstName,
      lastName,
      userTypeId,
      specialismId,
      email,
      password
    );
    return this.httpClient.post<SignupResponseData>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/user/create.php',
      { ...newUser, id: null }
    );
  }

  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }
}
