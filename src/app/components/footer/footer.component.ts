import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  date?: string;
  timerSubscriber: any = null;
  ngOnInit() {
    this.timerSubscriber = timer(0, 1000).subscribe(() => {
      this.date = Date().toString();
    });
  }
  ngOnDestroy() {
    this.timerSubscriber.unsubscribe();
  }
}
