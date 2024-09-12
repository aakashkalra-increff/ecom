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
  totalCartItems = 0;
  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.cartService.getItems().subscribe((res) => {
      this.totalCartItems = res.reduce((acc, item) => acc + item.quantity, 0);
    });
  }
  logout() {
    this.authService.logOut();
    this.cartService.updateLocalStorageKey();
    this.cartService.clearLocalStorage();
    this.router.navigate(['/']);
  }
}
