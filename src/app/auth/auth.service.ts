import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user.model';
import { tap } from 'rxjs/operators';
import { UserAuth } from './user-auth.model';
import { Plugins } from '@capacitor/core';

interface SignupResponseData {
  message: string;
  dbId: number;
}

interface LoginResponseData {
  message: string;
  idToken: string;
  email: string;
  userId: number;
  expiresAt: number;
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

  signup(
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
      password,
      null,
      null
    );
    return this.httpClient.post<SignupResponseData>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/user/create.php',
      { ...newUser }
    );
  }

  login(email: string, password: string) {
    this.httpClient.post<LoginResponseData>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/user/create.php',
      { email: email, password: password }
    ).pipe(
      tap(resData => {
        const user = new UserAuth(
          +resData.userId,
          resData.email,
          resData.idToken,
          new Date(resData.expiresAt)
        );
        this.storeAuthData(user.userId, user.email, user.token, user.expiryDate.toISOString());
      })
    );
  }

  logout() {
    this.isAuthenticated = false;
  }

  private storeAuthData(
    userId: number,
    email: string,
    idToken: string,
    expiresAt: string
  ) {
    const userAuthdata = JSON.stringify({
      userId: userId,
      email: email,
      idToken: idToken,
      expiresAt: expiresAt
    });
    Plugins.Storage.set({ key: 'userAuth', value: userAuthdata });
  }
}
