import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { authGuard } from './services/auth/auth-guard';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './services/auth/auth-guard';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderUploadComponent } from './components/order-upload/order-upload.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'order-upload',
    component: OrderUploadComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
