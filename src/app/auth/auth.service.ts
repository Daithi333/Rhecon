import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { tap, map, take } from 'rxjs/operators';
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
  userId: string;
  userTypeId: string;
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
      take(1),
      map(user => {
        if (user) {
          return user.userId;
        } else {
          return null;
        }
      })
    );
  }

  get userType() {
    return this._userAuth.asObservable().pipe(
      take(1),
      map(user => {
        if (user) {
          return user.userType;
        } else {
          return null;
        }
      })
    );
  }

  get email() {
    return this._userAuth.asObservable().pipe(
      map(user => {
        if (user) {
          return user.email;
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
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/user/signup.php',
      { ...newUser }
    );
  }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponseData>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/user/login.php',
      { email: email, password: password }
    ).pipe(
      tap(resData => {
        // store userType as string instead of number, for better readability
        let userType: string;
        if (+resData.userTypeId === 2) {
          userType = 'requester';
        } else if (+resData.userTypeId === 3) {
          userType = 'consultant';
        }
        const user = new UserAuth(
          +resData.userId,
          userType,
          resData.email,
          resData.token,
          new Date(resData.expiresAt * 1000)
        );
        this._userAuth.next(user);
        this.storeAuthData(user.userId, userType, user.email, user.token, user.expiresAt.toISOString());
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
          userType: string,
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
          data.userType,
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

  changePassword(email: string, currentPassword: string, newPassword: string) {
    return this.httpClient.post< {message: string} >(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/user/change_password.php',
      { email: email, currentPassword: currentPassword, newPassword: newPassword }
    );
  }

  resetPasswordEmail(email: string) {
    return this.httpClient.post<{ message: string }>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/user/reset_password.php',
      { email: email }
    );
  }

  logout() {
    this._userAuth.next(null);
    Plugins.Storage.remove({ key: 'userAuth' });
  }

  private storeAuthData(
    userId: number,
    userType: string,
    email: string,
    token: string,
    expiresAt: string
  ) {
    const userAuthdata = JSON.stringify({
      userId: userId,
      userType: userType,
      email: email,
      token: token,
      expiresAt: expiresAt
    });
    Plugins.Storage.set({ key: 'userAuth', value: userAuthdata });
  }

}
