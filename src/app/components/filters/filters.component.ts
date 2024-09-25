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
    const tempFilters = { ...this.filters };
    this.productService.getProductsCategories().subscribe((res) => {
      this.categories = res;
      this.removeInvalidFilterValues(tempFilters, 'category', this.categories);
    });
    this.productService.getProductsBrands().subscribe((res) => {
      this.brands = res;
      this.removeInvalidFilterValues(tempFilters, 'brand', this.brands);
      this.filterchange.emit(tempFilters);
    });
    if (tempFilters.gender && !genders.includes(tempFilters.gender)) {
      delete tempFilters.gender;
      this.filterchange.emit(tempFilters);
    }
  }
  removeInvalidFilterValues(filters: any, key: string, correctValues: string[]) {
    if (!filters[key] || !Array.isArray(filters[key])) return;
    filters[key] = filters[key].filter((e: string) =>
      correctValues.includes(e)
    );
    if (!filters[key].length) {
      delete filters[key];
    }
    this.filterchange.emit(filters);
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
