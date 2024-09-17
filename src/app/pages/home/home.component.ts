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
  showFilter = false;
  ngOnInit() {
    try {
      this.filters = JSON.parse(localStorage.getItem('filters')!);
    } catch (e) {
      this.filters = {};
      this.setFiltersToLocalStorage({});
    }
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
  setFiltersToLocalStorage(val: any) {
    localStorage.setItem('filters', JSON.stringify(val));
  }
  filterChanged(val: any) {
    this.filters = val;
    this.setFiltersToLocalStorage(this.filters);
    this.fetchProducts();
  }
  changeSort(event: any) {
    this.sort = event.target.value;
    localStorage.setItem('sort', this.sort!);
    this.fetchProducts();
  }
  setShowFilter(event: boolean) {
    this.showFilter = event;
  }
}
