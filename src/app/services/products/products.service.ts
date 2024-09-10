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
  getProducts(filters?: any, sort: string = 'featured') {
    return this.http.get<Product[]>(this.url).pipe(
      map((products) => {
        const filteredProducts = products.filter((product: Product) => {
          for (const [key, value] of Object.entries(filters || {})) {
            if (
              (Array.isArray(value) &&
                value.length &&
                value.includes(product[key as keyof Product]) === false) ||
              (!Array.isArray(value) && product[key as keyof Product] !== value)
            ) {
              return false;
            }
          }
          return true;
        });
        if (sort === 'featured') return filteredProducts;
        else {
          const desc = sort.charAt(0) === '-';
          const sortKey = sort.charAt(0) === '-' ? sort.slice(1) : sort;
          const sortedProducts = filteredProducts.sort(
            (a, b) =>
              Number(a[sortKey as keyof Product]) -
              Number(b[sortKey as keyof Product])
          );
          return desc ? sortedProducts.reverse() : sortedProducts;
        }
      })
    );
  }
  getProductsByID(id: string[]) {
    return this.http
      .get<Product[]>(this.url)
      .pipe(
        map((products) => products.filter(({ skuId }) => id.includes(skuId)))
      );
  }
  getProductsCategories() {
    return this.http.get<Product[]>(this.url).pipe(
      map((products) => {
        const obj: any = {};
        products.forEach((item) => {
          obj[item.category] = 1;
        });
        return Object.keys(obj);
      })
    );
  }
  getProductsBrands() {
    return this.http.get<Product[]>(this.url).pipe(
      map((products) => {
        const obj: any = {};
        products.forEach((item) => {
          obj[item.brand] = 1;
        });
        return Object.keys(obj);
      })
    );
  }
}
