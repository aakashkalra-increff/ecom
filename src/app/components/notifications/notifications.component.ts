import { Component } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
declare var $: any;
export interface notificationsType{
  message:string,
  type:string
}
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  items: notificationsType[] = [];
  constructor(private notificationsService: NotificationsService) {
    this.notificationsService.getNotifications().subscribe((res) => {
      this.items = res;
      if (res.length) {
        this.addNotification(res.length - 1);
      }
    });
  }
  addNotification(index: number) {
    setTimeout(() => {
      $('#toast-' + index).toast('show')
    }, 0);
  }
}
