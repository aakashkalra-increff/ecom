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
    const { files, value } = event.target;
    this.file = value;
    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const error: any[] = [];
          const columnsName = ['id', 'quantity'];
          const columnsCheck =
            columnsName.length !== res.meta.fields?.length ||
            columnsName.find((c, i) => c !== res.meta.fields?.at(i));
          if (columnsCheck) {
            this.fileParseError =
              'Error - File header names are not valid. First column should be id and second column should be qunatity.';
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
              if (e.id === '') {
                idError = " Item id can't be empty.";
              } else if (e.id && !p.find((p) => p.skuId === e.id)) {
                idError = ' Item id is invalid.';
              }
              if (e.quantity === '') {
                quantityError = " Item quantity can't be empty.";
              } else {
                const quantity = Number(e.quantity);
                if (isNaN(quantity) || !Number.isInteger(quantity)) {
                  quantityError = ' Item quantity must be an integer.';
                } else if (quantity < 1) {
                  quantityError = ' Item quantity must be greater than 0.';
                }
              }
              if (idError || quantityError) {
                error.push({
                  row: i + 1,
                  id: idError,
                  quantity: quantityError,
                });
              }
            });
            this.parseError = error;
            if (error.length) return;
            const obj = {} as { [key: string]: any };
            res.data.forEach((e: any) => {
              obj[e.id] = obj[e.id] ? obj[e.id] + e.quantity : e.quantity;
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
