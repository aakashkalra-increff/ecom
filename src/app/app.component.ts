import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ecom';
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.validateUser();
  }
}
