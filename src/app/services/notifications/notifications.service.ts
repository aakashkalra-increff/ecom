import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { notificationsType } from 'src/app/components/notifications/notifications.component';
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  notifications = new BehaviorSubject<notificationsType[]>([]);
  items = this.notifications.asObservable();
  addNotifications(val: notificationsType) {
    this.notifications.value.push(val);
    this.notifications.next(this.notifications.value);
  }
  getNotifications(){
    return this.items
  }
}
