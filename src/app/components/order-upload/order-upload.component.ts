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
  parseError?: string;
  file: string = '';
  onChange(event: any) {
    const { files, value } = event.target;
    this.file = value;
    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const columnsName = ['id', 'quantity'];
          const columnsCheck =
            columnsName.length !== res.meta.fields?.length ||
            columnsName.find((c, i) => c !== res.meta.fields?.at(i));
          const valueTypeCheck = res.data.find(
            (e: any) => isNaN(e.quantity) || !Number.isInteger(e.quantity)
          );
          if(valueTypeCheck){
            this.parseError='Quantity must be an integer.'
          }
          const valueCheck = res.data.find((e: any) => e.quantity < 1);
          const emptyValueCheck = res.data.find(
            (e: any) => !(e.id && e.quantity)
          );
          if (columnsCheck) {
            this.parseError = 'File header names are not valid.';
            return;
          }
          if (valueCheck) {
            this.parseError = 'Item quantity must be greater than 0.';
          }
          if (emptyValueCheck) {
            this.parseError = "Item id or quantity can't be empty.";
          }
          if (columnsCheck || valueCheck || emptyValueCheck) return;
          const obj = {} as { [key: string]: any };
          res.data.forEach((e: any) => {
            const id: string = e.id;
            const quantity: number = Number(e.quantity);
            if (!obj[id]) obj[id] = quantity;
            else obj[id] += quantity;
          });
          const ids = Object.keys(obj);
          this.productService.getProductsByID(ids).subscribe((res: any[]) => {
            console.log(res);
            const products = res.map((product) => ({
              product,
              id: product.skuId,
              quantity: obj[product.skuId],
            }));
            const invalidIds = ids.filter(
              (id) => !products.find((p) => p.id === id)
            );
            if (invalidIds.length) {
              this.parseError =
                invalidIds.join(',') +
                ' id(s) are invalid. Please check the products id.';
              return;
            }
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
    this.parseError = '';
  }
}
