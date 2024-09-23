import { Component, EventEmitter, Input, Output } from '@angular/core';
import { filter } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
const genders = ['Men', 'Women'];
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Output() filterchange = new EventEmitter();
  @Output() showFilterChanged = new EventEmitter();
  @Input() filters?: any = {};
  @Input() showFilter = false;
  categories?: string[] = [];
  brands: string[] = [];
  constructor(private productService: ProductsService) {}
  ngOnInit() {
    this.productService.getProductsCategories().subscribe((res) => {
      this.categories = res;
      const filters = { ...this.filters };
      if (filters.category && Array.isArray(filters.category)) {
        this.removeInvalidValues(filters, 'category', this.categories);
        this.filterchange.emit(filters);
      }
    });
    this.productService.getProductsBrands().subscribe((res) => {
      this.brands = res;
      const filters = { ...this.filters };
      if (filters.brand && Array.isArray(filters.brand)) {
        this.removeInvalidValues(filters, 'brand', this.brands);
        this.filterchange.emit(filters);
      }
    });
    const filters = { ...this.filters };
    if (filters.gender && !genders.includes(filters.gender)) {
      delete filters.gender;
      this.filterchange.emit(filters);
    }
  }
  removeInvalidValues(obj: any, key: string, correctValues: string[]) {
    obj[key] = obj[key].filter((e: string) => correctValues.includes(e));
    if (!obj[key].length) {
      delete obj[key];
    }
  }
  handleChange(event: any) {
    const name = event.name;
    const value = event.value;
    const newFilter = { ...this.filters, [name]: value };
    this.filterchange.emit(newFilter);
  }
  clearFilters() {
    this.filterchange.emit({});
  }
  hideFilters() {
    this.showFilterChanged.emit(false);
  }
  isFitersApplied() {
    return Object.keys({ ...this.filters }).length;
  }
}
