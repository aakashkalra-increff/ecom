import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/product';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private url = '.../../assets/inventory.json';
  constructor(private http: HttpClient) {}
  getProducts() {
    return this.http.get<Product[]>(this.url);
  }
  getProductsByID(id: string) {
    return this.http
      .get<Product[]>(this.url)
      .pipe(
        map((products) =>
          products.find(({ skuId }) => skuId === id)
        )
      );
  }
}
