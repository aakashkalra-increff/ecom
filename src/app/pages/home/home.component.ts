import { Component } from '@angular/core';
import { Product } from '../../product';
import { ProductsService } from '../../services/products/products.service';
const sortKeys = ['featured', 'price', '-price', '-rating'];
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
      this.filters = JSON.parse(sessionStorage.getItem('filters')!);
    } catch (e) {
      this.filters = {};
      this.setFiltersToSessionStorage({});
    }
    const sortValue = sessionStorage.getItem('sort') || 'featured';
    if (!sortKeys.includes(sortValue)) {
      this.sort = 'featured';
       sessionStorage.removeItem('sort');
    }
    this.fetchProducts();
  }
  fetchProducts() {
    this.productsService
      .getProducts(this.filters, this.sort)
      .subscribe((data) => {
        this.products = data;
      });
  }
  setFiltersToSessionStorage(val: any) {
    sessionStorage.setItem('filters', JSON.stringify(val));
  }
  filterChanged(val: any) {
    this.filters = val;
    this.setFiltersToSessionStorage(this.filters);
    this.fetchProducts();
  }
  changeSort(event: any) {
    this.sort = event.target.value;
    sessionStorage.setItem('sort', this.sort!);
    this.fetchProducts();
  }
  setShowFilter(event: boolean) {
    this.showFilter = event;
  }
}
