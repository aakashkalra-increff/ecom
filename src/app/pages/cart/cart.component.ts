import { Component, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
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
  quantity = 0;
  selectedItemId?: string | null = null;
  constructor(
    private cartService: CartService,
    private productService: ProductsService
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
        console.log('subscription called....', this.items);
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
}
