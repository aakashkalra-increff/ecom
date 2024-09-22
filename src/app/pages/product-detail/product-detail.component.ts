import { Component, ElementRef, ViewChild } from '@angular/core';
import { Product } from '../../product';
import { ProductsService } from '../../services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/app/services/cart/cartItem';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
declare var bootstrap: any;
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  @ViewChild('removeItemConfirmationModal')
  removeItemConfirmationModal!: ModalComponent;
  @ViewChild('carousel') carousel!: ElementRef;
  product?: Product;

  cartItem?: CartItem;
  quantityForm = new FormGroup({
    quantity: new FormControl<number>(1, [
      Validators.min(1),
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });
  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productsService
      .getProductsByID([id])
      .subscribe((res) => (this.product = res[0]));
    this.cartService.getItems().subscribe((res) => {
      const id = this.route.snapshot.paramMap.get('id')!;
      this.cartItem = res.find((e) => e.id === id);
      this.quantityForm.setValue({
        quantity: Number(this.cartItem?.quantity || 1),
      });
    });
  }
  ngAfterViewInit() {
    new bootstrap.Carousel(this.carousel.nativeElement, {
      interval: 2000,
    });
  }
  addItem() {
    this.cartService.addItem(
      this.product?.skuId!,
      Number(this.quantityForm.value.quantity)
    );
  }

  getColor(rating: number): string {
    if (rating <= 2.0) return 'red';
    if (rating <= 3.0) return 'orange ';
    return 'green';
  }

  updateQuantity(val: any) {
    if (this.cartItem) {
      this.cartService.updateItem({
        id: this.product?.skuId!,
        quantity: Number(val)!,
      });
    }
  }

  openConfirmationModal() {
    this.removeItemConfirmationModal.open();
  }

  removeCartItem() {
    this.cartService.removeItem(this.product?.skuId!);
    this.notificationsService.addNotifications({
      message: this.product?.name + ' is removed from cart',
      type: 'danger',
    });
  }
}
