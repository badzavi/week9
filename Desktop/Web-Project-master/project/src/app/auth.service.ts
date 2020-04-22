import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user:User;
  constructor() { }

  login() {
    this.user = {
      id: 1,
      username:'admin',
      password:'password'
    }
  }

  isAuthorized() {
    return !!this.user;
  }
}
