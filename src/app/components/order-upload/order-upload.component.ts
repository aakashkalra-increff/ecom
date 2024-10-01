import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ModalComponent } from '../modal/modal.component';
@Component({
  selector: 'app-order-upload',
  templateUrl: './order-upload.component.html',
  styleUrls: ['./order-upload.component.scss'],
})
export class OrderUploadComponent {
  @ViewChild('placeOrderConfirmationModal') modal?: ModalComponent;
  dataList?: any = null;
  constructor(
    private productService: ProductsService,
    private router: Router,
    public authService: AuthService
  ) {}
  items?: any;
  itemsTotalPrice = 0;
  deliveryCost = 0;
  totalCost = 0;
  fileParseError = '';
  parseError: any[] = [];
  file: string = '';
  onChange(event: any) {
    const numberRegex = /^\d+$/;
    const { files, value } = event.target;
    this.file = value;
    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const error: any[] = [];
          this.fileParseError = '';
          if (res.meta.fields?.length) {
            if (res.meta.fields[0] !== 'id') {
              this.fileParseError += ' First column name should be id';
            }
            if (res.meta.fields.length == 1) {
              this.fileParseError += ' quantity column is not present.';
            }
            if (res.meta.fields[1] !== 'quantity') {
              this.fileParseError += ' Second column name should be quantity.';
            }
            if (res.meta.fields.length > 2) {
              this.fileParseError +=
                ' Extra header are present. File should contain only 2 columns.';
            }
          } else {
            this.fileParseError =
              ' Header are not present, first column should be id and second column should be quantity.';
          }
          if (this.fileParseError) {
            this.fileParseError =
              'Error - File header names are not valid.' + this.fileParseError;
            return;
          }
          if (res.data.length > 100) {
            this.fileParseError = "Error - File can't have more than 100 rows.";
            return;
          }
          if (res.data.length == 0) {
            this.fileParseError = 'Error - File should have at least 1 row.';
            return;
          }
          const ids: string[] = res.data.map((e: any) => e.id);
          this.productService.getProductsByID(ids).subscribe((p: any[]) => {
            res.data.forEach((e: any, i: number) => {
              let idError = '';
              let quantityError = '';
              let id = e.id.trim();
              let quantity = e.quantity.trim();
              let extraValueError;
              if (id === '') {
                idError = " Item id can't be empty.";
              } else if (id && !p.find((p) => p.skuId === id)) {
                idError = ' Item id is invalid.';
              }
              if (e.quantity === '') {
                quantityError = " Item quantity can't be empty.";
              } else {
                quantity = Number(quantity);
                if (
                  isNaN(quantity) ||
                  !Number.isInteger(quantity) ||
                  !numberRegex.test(e.quantity)
                ) {
                  quantityError = ' Item quantity must be a number.';
                } else if (quantity < 1) {
                  quantityError = ' Item quantity must be atleast 1.';
                }
              }
              if (Object.keys(e).length > 2) {
                extraValueError =
                  'Extra Values are present. Each row should contain only 2 values.';
              }
              if (idError || quantityError || extraValueError) {
                error.push({
                  row: i + 1,
                  id,
                  idError,
                  quantityError,
                  extraValueError,
                });
              }
            });
            this.parseError = error;
            if (error.length) return;
            const obj = {} as { [key: string]: any };
            res.data.forEach((e: any) => {
              obj[e.id] = obj[e.id]
                ? Number(obj[e.id]) + Number(e.quantity)
                : Number(e.quantity);
            });
            const products = p.map((product) => ({
              product,
              id: product.skuId,
              quantity: obj[product.skuId],
            }));
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
    if (!this.authService.isLoggedIn()) {
      return;
    }
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
    this.modal?.close();
  }
  setEmptyValue(event: any) {
    event.target.value = '';
    this.items = [];
    this.fileParseError = '';
    this.parseError = [];
  }
  navigateToLogin() {
    this.router.navigate(['/login'], {
      queryParams: {
        redirect: 'order-upload',
      },
    });
  }
}
