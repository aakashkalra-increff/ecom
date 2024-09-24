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
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
declare var bootstrap: any;
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild('carousel') carousel!: ElementRef;
  @Input() product?: Product;
  cartItem?: CartItem;
  showButton = false;
  showCarousel = false;
  constructor(
    private cartService: CartService,
    private notificationsService: NotificationsService
  ) {}
  ngOnInit() {
    this.cartService.items.subscribe((res) => {
      this.cartItem = res.find((item) => item.id === this.product?.skuId);
    });
  }
  ngAfterViewInit() {
    const carouselElement = this.carousel.nativeElement;
    const carouselInstance = new bootstrap.Carousel(carouselElement, {
      interval: 2000,
      pause: false,
    });
    carouselInstance.pause();
    carouselElement.addEventListener('mouseenter', () => {
      carouselInstance.cycle();
    });
    carouselElement.addEventListener('mouseleave', () => {
      carouselInstance.pause();
    });
  }
  decrementQuantity() {
    if (this.cartItem?.quantity === 1) {
      this.modal.open();
      return;
    }
    this.cartService.updateItem({
      id: this.product?.skuId!,
      quantity: Number(this.cartItem?.quantity) - 1,
    });
  }
  incrementQuantity() {
    this.cartService.updateItem({
      id: this.product?.skuId!,
      quantity: Number(this.cartItem?.quantity) + 1,
    });
  }
  removeCartItem(id: string) {
    this.cartService.removeItem(id);
    this.notificationsService.addNotifications({
      message: this.product?.name + ' is removed from the cart.',
      type: 'danger',
    });
  }
  addToCart() {
    this.cartService.addItem(this.product?.skuId!);
    this.notificationsService.addNotifications({
      message: this.product?.name + ' is added to the cart.',
      type: 'success',
    });
  }
}
