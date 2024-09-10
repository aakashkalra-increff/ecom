import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Output() filterchange = new EventEmitter();
  @Input() filters?: any = {};
  categories?: string[] = [];
  brands: string[] = [];
  constructor(private productService: ProductsService) {}
  ngOnInit() {
    this.productService.getProductsCategories().subscribe((res) => {
      this.categories = res;
    });
    this.productService.getProductsBrands().subscribe((res) => {
      this.brands = res;
    });
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
    this.filterchange.emit({})
  }
}
