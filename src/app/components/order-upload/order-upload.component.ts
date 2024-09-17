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
  parseError: string[] = [];
  file: string = '';
  onChange(event: any) {
    const { files, value } = event.target;
    this.file = value;
    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const error: string[] = [];
          const columnsName = ['id', 'quantity'];
          const columnsCheck =
            columnsName.length !== res.meta.fields?.length ||
            columnsName.find((c, i) => c !== res.meta.fields?.at(i));
          if (columnsCheck) {
            error.push('Error - File header names are not valid.');
            this.parseError = error;
            return;
          }
          console.log(res.data);
          res.data.forEach((e: any, i: number) => {
            if (e.id === '') {
              error.push(
                'Error row - ' + Number(i + 1) + " Item id can't be empty."
              );
            }
            if (e.quantity === '') {
              error.push(
                'Error row - ' +
                  Number(i + 1) +
                  " Item quantity can't be empty."
              );
            } else {
              const quantity = Number(e.quantity);
              if (isNaN(quantity) || !Number.isInteger(quantity)) {
                error.push(
                  'Error row - ' +
                    Number(i + 1) +
                    ' Item quantity must be an integer.'
                );
              }
              if (quantity < 1) {
                error.push(
                  'Error row - ' +
                    Number(i + 1) +
                    ' Item quantity must be greater than 0.'
                );
              }
            }
          });
          this.parseError = error;
          if (error.length) return;
          const obj = {} as { [key: string]: any };
          res.data.forEach((e: any) => {
            const id: string = e.id;
            const quantity: number = Number(e.quantity);
            if (!obj[id]) obj[id] = quantity;
            else obj[id] += quantity;
          });
          const ids = Object.keys(obj);
          this.productService.getProductsByID(ids).subscribe((p: any[]) => {
            const products = p.map((product) => ({
              product,
              id: product.skuId,
              quantity: obj[product.skuId],
            }));
            res.data.forEach((e: any, i: number) => {
              if (!products.find(({ id }) => id === e.id)) {
                this.parseError.push(
                  'Error row - ' + Number(i + 1) + ' Item id is invalid.'
                );
              }
            });
            if (this.parseError.length) return;
            this.items = products;
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
  setEmptyValue(event: any) {
    event.target.value = '';
    this.items = [];
    this.parseError = [];
  }
}
