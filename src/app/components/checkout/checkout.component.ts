import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as Papa from 'papaparse';
import { data } from 'jquery';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  orderInfo?: any;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    const ordersKey = 'user/' + this.authService.getUserId() + '/current_order';
    this.orderInfo = JSON.parse(localStorage.getItem(ordersKey)!);
  }
  ngOnDestroy() {
    const ordersKey = 'user/' + this.authService.getUserId() + '/current_order';
    localStorage.removeItem(ordersKey);
  }
  convertToCSV() {
    const itemsData = this.orderInfo.items.map((item: any, i: number) => [
      i + 1,
      ...Object.values(item),
    ]);
    const data = {
      fields: ['Sr. No.', 'Name', 'Price', 'quantity', 'total'],
      data: itemsData,
    };
    const csv = Papa.unparse(data);
    var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var csvURL = window.URL.createObjectURL(csvData);
    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'Order_Details.csv');
    tempLink.click();
  }
}
