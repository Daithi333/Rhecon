import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = true;
  private _userId = 1;

  get isUserAuthenticated() {
    return this.isAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor() { }

  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }
}
