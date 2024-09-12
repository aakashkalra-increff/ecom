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
  items?: any[];
  itemsTotalPrice = 0;
  deliveryCost = 40;
  totalCost = 0;
  selectedItemId?: string | null = null;
  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductsService,
    private authService: AuthService
  ) {
    this.cartService.getItems().subscribe((res) => {
      const ids = res.map(({ id }) => id);
      this.productService.getProductsByID(ids).subscribe((products: any[]) => {
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
  placeOrder() {
    this.router.navigate(['/checkout']);
    const ordersKey = 'user/' + this.authService.getUserId() + '/current_order';
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
  }
}
