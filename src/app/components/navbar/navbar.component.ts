import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ModalComponent } from '../modal/modal.component';
declare var bootstrap: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @ViewChild(ModalComponent) modal?: ModalComponent;
  totalCartItems = 0;
  user?: any;
  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.cartService.items.subscribe((res) => {
      this.totalCartItems = Object.values(res).reduce(
        (acc, item) => acc as number + Number(item),
        0
      ) as number;
    });
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });
  }
  ngAfterViewInit() {
    const tooltipElements = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipElements.map((element) => {
      new bootstrap.Tooltip(element, {
        trigger: 'hover',
      });
    });
  }
  logout() {
    this.authService.logOut();
    this.cartService.updateLocalStorageKey();
    this.cartService.saveItems({});
    this.router.navigate(['/']);
  }
}
