import {
  Component,
  Input,
  ChangeDetectorRef,
  NgZone,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Product } from 'src/app/product';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/app/services/cart/cartItem';
import { ModalComponent } from '../modal/modal.component';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
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
    if (this.cartItem?.quantity === 1) {
      this.openConfirmationModal();
    } else {
      this.cartService.decrementQuantity(this.product?.skuId!);
    }
  }
  openConfirmationModal() {
    this.modal.open();
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
  removeCartItem(id: string) {
    this.cartService.removeItem(id);
  }
  getColor(rating: number): string {
    if (rating <= 2.0) return 'red';
    if (rating <= 3.0) return 'orange ';
    return 'green';
  }
  addToCart() {
    this.cartService.addItem(this.product?.skuId!);
  }
}
