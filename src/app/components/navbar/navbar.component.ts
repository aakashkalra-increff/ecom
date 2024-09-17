import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ModalComponent } from '../modal/modal.component';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @ViewChild(ModalComponent) modal?: ModalComponent;
  totalCartItems = 0;
  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.cartService.getItems().subscribe((res) => {
      this.totalCartItems = res.reduce((acc, item) => acc + item.quantity, 0);
    });
    $(document).ready(function(){
      $('[data-bs-toggle="tooltip"]').tooltip();
    });
  }
  openLogoutConfirmationModal(){
    this.modal?.open()
  }
  ngAfterViewInit(){
    $('[data-toggle="tooltip"]').tooltip();
  }
  logout() {
    this.authService.logOut();
    this.cartService.updateLocalStorageKey();
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }
}
