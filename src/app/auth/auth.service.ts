import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';

import { User } from './user.model';
import { UserAuth } from './user-auth.model';

interface SignupResponseData {
  message: string;
  dbId: number;
}

interface LoginResponseData {
  message: string;
  token: string;
  email: string;
  userId: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userAuth = new BehaviorSubject<UserAuth>(null);

  get isUserAuthenticated() {
    return this._userAuth.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._userAuth.asObservable().pipe(
      map(user => {
        if (user) {
          return user.userId;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._userAuth.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
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
    return this.httpClient.post<LoginResponseData>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/user/read_single.php',
      { email: email, password: password }
    ).pipe(
      tap(resData => {
        // console.log(resData);
        const user = new UserAuth(
          +resData.userId,
          resData.email,
          resData.token,
          new Date(resData.expiresAt * 1000)
        );
        // console.log(user);
        this._userAuth.next(user);
        // console.log(this._userAuth);
        this.storeAuthData(user.userId, user.email, user.token, user.expiresAt.toISOString());
      })
    );
  }

  autoLogin() {
    return from(Plugins.Storage.get({key: 'userAuth'})).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const data = JSON.parse(storedData.value) as {
          userId: string,
          email: string
          token: string,
          expiresAt: string,
        };
        const expirationTime = new Date(data.expiresAt);
        if (expirationTime <= new Date()) {
          console.log('auto logged out');
          this.logout();
          return null;
        }
        const user = new UserAuth(
          +data.userId,
          data.email,
          data.token,
          expirationTime);
        return user;
      }),
      tap(user => {
        if (user) {
          this._userAuth.next(user);
          console.log('auto logged in');
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  logout() {
    this._userAuth.next(null);
    Plugins.Storage.remove({ key: 'userAuth' });
  }

  private storeAuthData(
    userId: number,
    email: string,
    token: string,
    expiresAt: string
  ) {
    const userAuthdata = JSON.stringify({
      userId: userId,
      email: email,
      token: token,
      expiresAt: expiresAt
    });
    Plugins.Storage.set({ key: 'userAuth', value: userAuthdata });
  }

}
