import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/app/services/cart/cartItem';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  items?: CartItem[];
  constructor(private cartService: CartService){
    this.cartService.getItems().subscribe(res=>{
      this.items=res;
    })
  }
  
}
