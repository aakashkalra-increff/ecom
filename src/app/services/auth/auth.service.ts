import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public router: Router) {}
  logIn() {}
  logOut() {}
  isLoggedIn(){
    return localStorage.getItem('token')
  }
}
