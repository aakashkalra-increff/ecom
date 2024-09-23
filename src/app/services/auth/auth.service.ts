import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
export interface User {
  email: string;
  password: string;
  userId: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersFilePath = '../../../assets/users.json';
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
      localStorage.setItem('userId', user.userId);
    } else {
      throw 'Invalid email or password';
    }
  }
  logOut() {
    localStorage.removeItem('userId');
  }
  isLoggedIn() {
    return !!localStorage.getItem('userId');
  }
  getUserId() {
    return localStorage.getItem('userId');
  }
  async validateUser() {
    if (!this.isLoggedIn()) return;
    const users = await firstValueFrom(this.getUsers());
    const userId = localStorage.getItem('userId');
    const user = users.find((user) => user.userId == userId);
    if (!user) {
      this.logOut();
    }
  }
}
