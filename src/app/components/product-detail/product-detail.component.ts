import { Component } from '@angular/core';
import { InventoryInfo, Product } from '../../product';
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
  quantity = 1;
  cartItem?: CartItem;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productsService
      .getProductsByID(id)
      .subscribe((res) => (this.product = res));
    this.cartService.getItems().subscribe((res) => {
      console.log(
        res,
        res.find((e) => e.id === id)
      );
      this.cartItem = res.find((e) => e.id === id);
      this.quantity = this.cartItem?.quantity || 1;
    });
  }
  addItem() {
    this.cartService.addItem(this.product?.skuId!, Number(this.quantity));
  }
  getColor(rating: number): string {
    if (rating <= 2.0) return 'red';
    if (rating <= 3.0) return 'orange ';
    return 'green';
  }
  // isAvailable(inventory: InventoryInfo[], size: string) {
  //   console.log(
  //     inventory,
  //     size,
  //     inventory.find((e) => e.label === size)
  //   );
  //   return inventory.find((e) => e.label === size);
  // }
  updateQuantity(event: any) {
    console.log(event.target.value);
    this.quantity = event.target.value;
    if (this.cartItem) {
      this.cartService.updateItem({
        id: this.product?.skuId!,
        quantity: Number(this.quantity)!,
      });
    }
  }
  handleRemoveItem(){
    
  }
}
