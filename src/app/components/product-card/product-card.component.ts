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
  removeCartItem(id: string) {
    this.cartService.removeItem(id);
    this.notificationsService.addNotifications({
      message: this.product?.name + ' is removed from cart',
      type: 'danger',
    });
  }
  getColor(rating: number): string {
    if (rating <= 2.0) return 'red';
    if (rating <= 3.0) return 'orange ';
    return 'green';
  }
  addToCart() {
    this.cartService.addItem(this.product?.skuId!);
    this.notificationsService.addNotifications({
      message: this.product?.name + ' is added to cart.',
      type: 'success',
    });
  }
}
