import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}
  logout() {
    this.authService.logOut();
    this.cartService.updateLocalStorageKey();
    this.cartService.clearLocalStorage()
    this.router.navigate(['/']);
  }
}
