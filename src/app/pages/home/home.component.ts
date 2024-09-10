import { Component } from '@angular/core';
import { Product } from '../../product';
import { ProductsService } from '../../services/products/products.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  products?: Product[];
  filters = {};
  sort?: string = 'featured';
  constructor(private productsService: ProductsService) {}
  ngOnInit() {
    this.filters = JSON.parse(localStorage.getItem('filters')!);
    this.sort = localStorage.getItem('sort')! || 'featured';
    this.fetchProducts();
  }
  fetchProducts() {
    this.productsService
      .getProducts(this.filters, this.sort)
      .subscribe((data) => {
        this.products = data;
      });
  }
  filterChanged(val: any) {
    this.filters = val;
    localStorage.setItem('filters', JSON.stringify(val));
    this.fetchProducts();
  }
  changeSort(event: any) {
    this.sort = event.target.value;
    localStorage.setItem('sort', this.sort!);
    this.fetchProducts();
  }
}
