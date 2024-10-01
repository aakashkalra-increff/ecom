import { Component } from '@angular/core';
import { Product } from '../../product';
import { ProductsService } from '../../services/products/products.service';
import { BehaviorSubject } from 'rxjs';
const sortKeys = ['featured', 'price', '-price', '-rating'];
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  products?: Product[];
  filters: any = {};
  sort?: string = 'featured';
  showFilter = false;
  sortItems: any[] = [
    {
      label: 'Featured',
      value: 'featured',
    },
    {
      label: 'Price : Low to High',
      value: 'price',
    },
    {
      label: 'Price : High to Low',
      value: '-price',
    },
    {
      label: 'Customer Rating',
      value: '-rating',
    },
  ];
  filtersCount = 0;
  sortLabel = 'featured';
  constructor(private productsService: ProductsService) {}
  ngOnInit() {
    this.setAndApplyFiltersAndSort();
    window.addEventListener('sessionStorageChange', () => {
      this.setAndApplyFiltersAndSort();
    });
  }
  setAndApplyFiltersAndSort() {
    try {
      this.filters = JSON.parse(sessionStorage.getItem('filters')!);
      this.filtersCount = this.getFiltersCount();
    } catch (e) {
      this.filters = {};
      this.setFiltersToSessionStorage({});
    }
    this.sort = sessionStorage.getItem('sort') || 'featured';
    this.sortLabel = this.getSortLabel();
    if (!sortKeys.includes(this.sort)) {
      this.sort = 'featured';
      this.sortLabel = 'featured';
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
  handleFilterChange(val: any) {
    this.filters = val;
    this.setFiltersToSessionStorage(this.filters);
    this.fetchProducts();
    this.filtersCount = this.getFiltersCount();
  }
  changeSort(value: string) {
    this.sort = value;
    sessionStorage.setItem('sort', this.sort!);
    this.fetchProducts();
    this.sortLabel = this.getSortLabel();
  }
  setShowFilter(val: boolean) {
    this.showFilter = val;
  }
  getSortLabel() {
    return this.sortItems.find((item) => item.value === this.sort).label;
  }
  getFiltersCount() {
    return (
      (this.filters?.category?.length || 0) +
      (this.filters?.brand?.length || 0) +
      (this.filters?.gender ? 1 : 0)
    );
  }
}
