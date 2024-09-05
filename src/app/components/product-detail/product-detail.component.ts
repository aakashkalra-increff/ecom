import { Component } from '@angular/core';
import { Product } from '../../product';
import { ProductsService } from '../../services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { CartItem } from 'src/app/services/cart/cartItem';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}
  product?: Product;
  quantity = new FormControl(1);
  cartItem?: CartItem;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productsService
      .getProductsByID(id)
      .subscribe((res) => (this.product = res));
    this.cartService.getItems().subscribe((res) => {
      this.cartItem = res.find((e) => e.id === id);
    });

    this.quantity.valueChanges.subscribe((val)=>{
      if (this.cartItem) {
        this.cartService.updateItem({
          id: this.product?.clientSkuId!,
          quantity: Number(val)!,
        });
      }
    })
  }
  addItem() {
    this.cartService.addItem(this.product?.clientSkuId!, Number(this.quantity));
  }
}
