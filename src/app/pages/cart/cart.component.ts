import { Component, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild('clearCartModal') clearCartModal!: ModalComponent;
  @ViewChild('placeOrderConfirmation') placeOrderConfirmation!: ModalComponent;
  items?: any[];
  itemsTotalPrice = 0;
  deliveryCost = 40;
  totalCost = 0;
  selectedItemId?: string | null = null;
  options = new Array(20).fill(0).map((_, i) => i + 1);
  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductsService,
    private authService: AuthService
  ) {
    setTimeout(() => {
      this.cartService.getItems().subscribe((res) => {
        const ids = res.map(({ id }) => id);
        this.productService
          .getProductsByID(ids)
          .subscribe((products: any[]) => {
            this.items = products.map((product) => ({
              product,
              ...res.find((e) => e.id === product.skuId),
            }));
            this.itemsTotalPrice = this.items.reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0
            );
            this.deliveryCost = this.itemsTotalPrice < 500 ? 40 : 0;
            this.totalCost = this.itemsTotalPrice + this.deliveryCost;
          });
      });
    }, 0);
  }
  updateQuantity(event: any, id: string) {
    this.cartService.updateItem({
      id,
      quantity: Number(event.target.value)!,
    });
  }
  removeCartItem() {
    this.cartService.removeItem(this.selectedItemId!);
    this.selectedItemId = null;
  }
  openConfirmationModal(id: string) {
    this.selectedItemId = id;
    this.modal.open();
  }
  openClearCartConfirmationModal() {
    this.clearCartModal.open();
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
  openPlaceOrderConfirmation() {
    this.placeOrderConfirmation.open();
  }
  clearCart() {
    this.cartService.clearCart();
  }
}
