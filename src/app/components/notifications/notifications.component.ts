import { Component, ElementRef, ViewChildren } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
declare var bootstrap: any;
export interface notificationsType {
  message: string;
  type: string;
}
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  items: notificationsType[] = [];
  @ViewChildren('notifications') notifications?: any = [];
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
      new bootstrap.Toast(this.notifications?._results[index].nativeElement, {
        autohide: true,
        delay: 2000,
      }).show();
    }, 0);
  }
}
