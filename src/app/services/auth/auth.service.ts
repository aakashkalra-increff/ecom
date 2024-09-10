import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CartService } from '../cart/cart.service';
export interface User {
  email: string;
  password: string;
  userId: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public router: Router,
    private http: HttpClient,
  ) {}
  async logIn(email: String, password: string) {
    const users = await firstValueFrom(
      this.http.get<User[]>('../../../assets/users.json')
    );
    const user = users.find(
      (e) => e.email === email && e.password === password
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
}
