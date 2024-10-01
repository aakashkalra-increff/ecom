import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ModalComponent } from '../modal/modal.component';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
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
    private cartService: CartService,
    private notificationService: NotificationsService
  ) {
    this.cartService.items.subscribe((res) => {
      this.totalCartItems = Object.values(res).reduce(
        (acc, item) => (acc as number) + Number(item),
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
    this.notificationService.addNotifications({
      message: 'logged out successfully',
    });
    sessionStorage.setItem('filters', JSON.stringify({}));
    const event = new CustomEvent('sessionStorageChange', {});
    window.dispatchEvent(event);
    this.cartService.updateLocalStorageKey();
    this.cartService.saveItems({});
  }
}
