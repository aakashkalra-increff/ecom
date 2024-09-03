import { Component } from '@angular/core';
import { Product } from '../../product';
import { ProductsService } from '../../services/products/products.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}
  product?: Product;
  inCart: Boolean = false;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productsService
      .getProductsByID(id)
      .subscribe((res) => (this.product = res));
  }
}
