import { Component } from '@angular/core';
import { interval, of } from 'rxjs';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  date?: string;
  interval?: any;
  ngOnInit() {
    this.interval = interval(1000).subscribe(() => {
      this.date = Date().toString();
    });
  }
  ngOnDestroy(){
    this.interval
  }
}
