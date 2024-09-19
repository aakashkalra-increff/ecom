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
        filters.category = filters.category.filter((c: string) =>
          this.categories?.includes(c)
        );
        if (!filters.category.length) {
          delete filters.category;
        }
        this.filterchange.emit(filters);
      }
    });
    this.productService.getProductsBrands().subscribe((res) => {
      this.brands = res;
      const filters = { ...this.filters };
      if (filters.brand && Array.isArray(filters.category)) {
        filters.brand = filters.category.filter((b: string) =>
          this.brands?.includes(b)
        );
        if (!filters.brand.length) {
          delete filters.brand;
        }
        this.filterchange.emit(filters);
      }
    });
    const filters = { ...this.filters };
    if (filters.gender && !genders.includes(filters.gender)) {
      delete filters.gender;
      this.filterchange.emit(filters);
    }
  }
  sanatizeFilters() {
    const newFilters: any = {};
  }
  handleChange(event: Event) {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;
    const newFilter = { ...this.filters, [name]: value };
    this.filterchange.emit(newFilter);
  }
  handleCheckbBoxGroupChange(event: any) {
    const name = event.name;
    const value = event.value;
    const newFilters = { ...this.filters, [name]: value };
    this.filterchange.emit(newFilters);
  }
  clearFilters() {
    this.filterchange.emit({});
  }
  hideFilters() {
    this.showFilterChanged.emit(false);
  }
  isFitersApplied() {
    return Object.keys(this.filters).length;
  }
}
