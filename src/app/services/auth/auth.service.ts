import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, firstValueFrom, BehaviorSubject } from 'rxjs';
export interface User {
  email: string;
  password: string;
  userId: string;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersFilePath = '../../../assets/users.json';
  private authKey = 'user';
  private user = new BehaviorSubject({});
  constructor(public router: Router, private http: HttpClient) {}
  getUsers() {
    return this.http.get<User[]>(this.usersFilePath);
  }
  async logIn(email: String, password: string) {
    const users = await firstValueFrom(this.getUsers());
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      this.user.next(user);
      localStorage.setItem(this.authKey, user.userId);
    } else {
      throw 'Invalid email or password';
    }
  }
  logOut() {
    localStorage.removeItem(this.authKey);
    sessionStorage.clear();
  }
  isLoggedIn() {
    return !!localStorage.getItem(this.authKey);
  }
  getUserId() {
    return localStorage.getItem(this.authKey);
  }
  getUser() {
    return this.user;
  }
  async validateUser() {
    if (!this.isLoggedIn()) return;
    const users = await firstValueFrom(this.getUsers());
    const userId = localStorage.getItem(this.authKey);
    const user = users.find((user) => user.userId == userId);
    if (!user) {
      this.logOut();
    }
    this.user.next({...user});
  }
}
