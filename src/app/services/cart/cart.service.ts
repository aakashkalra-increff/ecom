import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from './cartItem';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  items: Observable<CartItem[]> = this.cartItems.asObservable();
  constructor() {}
  getItems() {
    return this.items;
  }
  updateItem(item: CartItem) {
    const newItems = this.cartItems.value.map((e) =>
      e.id === item.id ? item : e
    );
    this.cartItems.next(newItems);
  }
  addItem(id: string, quantity: number = 1) {
    this.cartItems.value.push({ id, quantity });
    this.cartItems.next(this.cartItems.value);
  }
  decrementQuantity(id: string) {
    const index = this.cartItems.value.findIndex((e) => e.id === id);
    const item = this.cartItems.value[index];
    if (item?.quantity === 1) {
      this.cartItems.next(this.cartItems.value.filter((e) => e.id !== id));
    } else {
      this.cartItems.value[index] = { ...item, quantity: item.quantity - 1 };
      this.cartItems.next(this.cartItems.value);
    }
  }
  incrementQuantity(id: string) {
    const index = this.cartItems.value.findIndex((e) => e.id === id);
    if (index > -1) {
      this.cartItems.value[index].quantity++;
    } else {
      this.cartItems.value.push({ id, quantity: 1 });
    }
    this.cartItems.next(this.cartItems.value);
  }
  getItem(id: string) {
    return this.cartItems.getValue().find((item) => item.id === id);
  }
}
