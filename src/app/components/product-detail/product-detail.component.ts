import { Component, ViewChild } from '@angular/core';
import { InventoryInfo, Product } from '../../product';
import { ProductsService } from '../../services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/app/services/cart/cartItem';
import { ModalComponent } from '../modal/modal.component';
declare var $: any;
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  product?: Product;
  quantity = 1;
  cartItem?: CartItem;
  options = new Array(20).fill(0).map((_, i) => i + 1);

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productsService
      .getProductsByID([id])
      .subscribe((res) => (this.product = res[0]));
    setTimeout(() => {
      this.cartService.getItems().subscribe((res) => {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.cartItem = res.find((e) => e.id === id);
        this.quantity = Number(this.cartItem?.quantity || 1);
      });
    }, 0);
  }

  addItem() {
    this.cartService.addItem(this.product?.skuId!, Number(this.quantity));
  }

  getColor(rating: number): string {
    if (rating <= 2.0) return 'red';
    if (rating <= 3.0) return 'orange ';
    return 'green';
  }

  updateQuantity(event: any) {
    const val = event.target.value;
    console.log(val, isNaN(val), Number(val));
    if (isNaN(val) || Number(val) < 0) return;
    this.quantity = +event.target.value;
    if (this.cartItem) {
      this.cartService.updateItem({
        id: this.product?.skuId!,
        quantity: Number(this.quantity)!,
      });
    }
  }

  openConfirmationModal() {
    this.modal.open();
  }

  removeCartItem() {
    this.cartService.removeItem(this.product?.skuId!);
  }
}
