import { Component } from '@angular/core';
import { event } from 'jquery';
import { map } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/app/services/cart/cartItem';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  items?: any[];
  itemsTotalPrice = 0;
  deliveryCost = 40;
  totalCost = 0;
  quantity = 0;
  constructor(
    private cartService: CartService,
    private productService: ProductsService
  ) {
    this.cartService.getItems().subscribe((res) => {
      const ids = res.map(({ id }) => id);
      this.productService.getProductsByID(ids).subscribe((items: any[]) => {
        this.items = items.map((product, i) => ({ product, ...res[i] }));
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
}
