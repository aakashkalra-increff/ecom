import {
  Component,
  Input,
  ChangeDetectorRef,
  NgZone,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { interval } from 'rxjs';
import { Product } from 'src/app/product';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/app/services/cart/cartItem';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product?: Product;
  cartItem?: CartItem;
  showButton = false;
  showCarousel = false;
  carousel?: any;
  constructor(private cartService: CartService) {}
  ngOnInit() {
    this.cartService.getItems().subscribe((res) => {
      this.cartItem = res.find((item) => item.id === this.product?.skuId);
    });
  }
  decrementQuantity() {
    this.cartService.decrementQuantity(this.product?.skuId!);
  }
  incrementQuantity() {
    this.cartService.incrementQuantity(this.product?.skuId!);
  }
  ngAfterViewInit() {
    $('#carousel-' + this.product?.skuId).carousel('pause');
    $('#carousel-' + this.product?.skuId).hover(
      () => {
        setTimeout(() => {
          $('#carousel-' + this.product?.skuId).carousel('next', {
            interval: 2000,
          });
        }, 1000);
      },
      () => {
        $('#carousel-' + this.product?.skuId).carousel('pause');
      }
    );
  }
}
