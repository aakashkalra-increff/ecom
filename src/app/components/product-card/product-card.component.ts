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
  showButton = false;
  constructor(private cartService: CartService) {}
  ngOnInit() {
    this.cartService.getItems().subscribe((res) => {
      this.cartItem = res.find((item) => item.id === this.product?.skuId);
    });
  }
  decrementQuantity(){
    this.cartService.decrementQuantity(this.product?.skuId!)
  }
  incrementQuantity(){
    this.cartService.incrementQuantity(this.product?.skuId!)
  }
}
