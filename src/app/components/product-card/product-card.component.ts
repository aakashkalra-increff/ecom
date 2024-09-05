import { Component, Input } from '@angular/core';
import { Product } from 'src/app/product';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/app/services/cart/cartItem';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product?: Product;
  cartItem?: CartItem;
  constructor(private cartService: CartService) {}
  ngOnInit() {
    this.cartService.getItems().subscribe((res) => {
      this.cartItem = res.find((item) => item.id === this.product?.clientSkuId);
    });
  }
  decrementQuantity(){
    this.cartService.decrementQuantity(this.product?.clientSkuId!)
  }
  incrementQuantity(){
    this.cartService.incrementQuantity(this.product?.clientSkuId!)
  }
}
