import { Component } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  items: string[] = [];
  constructor(private notificationsService: NotificationsService) {
    this.notificationsService.getNotifications().subscribe((res) => {
      this.items = res;
      if (res.length) {
        this.addNotification(res.length - 1);
      }
    });
  }
  ngAfterViewInit() {
    console.log('component rendering!!!');
  }
  addNotification(index: number) {
    setTimeout(() => {
      console.log($('#toast-' + index).toast('show'));
    }, 1000);
  }
}
