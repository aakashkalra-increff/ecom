import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  notifications = new BehaviorSubject<string[]>([]);
  items = this.notifications.asObservable();
  addNotifications(val: string) {
    this.notifications.value.push(val);
    this.notifications.next(this.notifications.value);
  }
  getNotifications(){
    return this.items
  }
}
