import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
@Component({
  selector: 'app-order-upload',
  templateUrl: './order-upload.component.html',
  styleUrls: ['./order-upload.component.scss'],
})
export class OrderUploadComponent {
  dataList?: any = null;
  constructor(
    private cartService: CartService,
    private productService: ProductsService,
    private router: Router,
    private authService: AuthService
  ) {}
  items?: any;
  itemsTotalPrice = 0;
  deliveryCost = 0;
  totalCost = 0;
  onChange(event: any) {
    const { files } = event.target;
    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          // const columnsName = ['id', 'quantity'];
          const ids = res.data.map((e: any) => e.id);
          console.log(ids);
          this.productService
            .getProductsByID(ids)
            .subscribe((products: any[]) => {
              this.items = products.map((product) => ({
                product,
                ...Object.assign(
                  {},
                  res.data.find((e: any) => e.id === product.skuId)
                ),
              }));
              this.itemsTotalPrice = this.items.reduce(
                (acc: number, item: any) =>
                  acc + item.product.price * item.quantity,
                0
              );
              this.deliveryCost = this.itemsTotalPrice < 500 ? 40 : 0;
              this.totalCost = this.itemsTotalPrice + this.deliveryCost;
            });
        },
      });
    }
  }
  placeOrder() {
    this.router.navigate(['/checkout']);
    const ordersKey = 'user/' + this.authService.getUserId() + '/current_order';
    const orderInfo = {
      items:
        this.items?.map((item: any) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.quantity * item.product.price,
        })) || [],
      totalCost: this.totalCost,
      shippingCost: this.totalCost,
      itemsTotalPrice: this.itemsTotalPrice,
    };
    localStorage.setItem(ordersKey, JSON.stringify(orderInfo));
  }
}
