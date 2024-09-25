import { Component, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  @ViewChild('removeItemConfirmationModal')
  removeItemConfirmationModal!: ModalComponent;
  @ViewChild('clearCartModal') clearCartModal!: ModalComponent;
  @ViewChild('placeOrderConfirmation') placeOrderConfirmation!: ModalComponent;
  items?: any[];
  itemsTotalPrice = 0;
  deliveryCost = 40;
  totalCost = 0;
  selectedItemId?: string | null = null;
  quantityForms?: any;
  loggedIn = false;
  totalItems = 0;
  constructor(
    private router: Router,
    public cartService: CartService,
    private productService: ProductsService,
    private authService: AuthService,
    private notificationsService: NotificationsService
  ) {}
  ngOnInit() {
    this.cartService.items.subscribe((res) => {
      const ids = res.map(({ id }) => id);
      this.productService.getProductsByID(ids).subscribe((products: any[]) => {
        this.items = products.map((product) => ({
          product,
          ...res.find((e) => e.id === product.skuId),
        }));
        this.items.forEach((item) => {
          this.totalItems += item.quantity;
          this.itemsTotalPrice += item.product.price * item.quantity;
        });
        // this.itemsTotalPrice = this.items.reduce(
        //   (acc, item) => acc + item.product.price * item.quantity,
        //   0
        // );
        this.deliveryCost = this.itemsTotalPrice < 500 ? 40 : 0;
        this.totalCost = this.itemsTotalPrice + this.deliveryCost;
        this.quantityForms = this.items?.map((item) => {
          return new FormGroup({
            quantity: new FormControl<number>(item.quantity, [
              Validators.min(1),
              Validators.max(100),
              Validators.required,
              Validators.pattern('^[0-9]*$'),
            ]),
          });
        });
      });
    });
    this.loggedIn = this.authService.isLoggedIn();
  }
  updateQuantity(val: any, id: string) {
    this.cartService.updateItem({
      id,
      quantity: val,
    });
  }
  removeCartItem() {
    this.cartService.removeItem(this.selectedItemId!);
    const item = this.items?.find((item) => item.id === this.selectedItemId);
    this.notificationsService.addNotifications({
      message: item.product.name + ' is removed from the cart.',
      type: 'danger',
    });
    this.selectedItemId = null;
  }
  openRemoveItemConfirmationModal(id: string) {
    this.selectedItemId = id;
    this.removeItemConfirmationModal.open();
  }
  placeOrder() {
    const userId = this.authService.getUserId();
    const ordersKey = 'user/' + userId + '/current_order';
    const orderInfo = {
      items:
        this.items?.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.quantity * item.product.price,
        })) || [],
      totalCost: this.totalCost,
      shippingCost: this.totalCost,
      itemsTotalPrice: this.itemsTotalPrice,
    };
    localStorage.setItem(ordersKey, JSON.stringify(orderInfo));
    this.cartService.clearCart();
    this.router.navigate(['/checkout']);
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
