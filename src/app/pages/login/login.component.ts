import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  authError: string = '';
  loading: Boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}
  async onSubmit() {
    const { email, password } = this.loginForm.value;
    this.loading = true;
    try {
      await this.authService.logIn(email!, password!);
      this.authError = '';
      const redirectPage = this.route.snapshot.queryParamMap.get('redirect');
      this.router.navigate(redirectPage ? ['/' + redirectPage] : ['/']);
      this.cartService.updateCart();
    } catch (e) {
      this.authError = 'Invalid email or password';
    } finally {
      this.loading = false;
    }
  }
}
