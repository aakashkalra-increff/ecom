import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from './cartItem';
import { data } from 'jquery';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private localStorageCartKey = 'cart';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  items: Observable<CartItem[]> = this.cartItems.asObservable();
  constructor() {
    this.cartItems.next(
      JSON.parse(localStorage.getItem(this.localStorageCartKey)!) || []
    );
  }
  getItems() {
    return this.items;
  }
  saveItemsToLocalStorage(data: CartItem[]) {
    localStorage.setItem(this.localStorageCartKey, JSON.stringify(data));
  }
  updateItem(item: CartItem) {
    const newItems = this.cartItems.value.map((e) =>
      e.id === item.id ? item : e
    );
    this.cartItems.next(newItems);
    this.saveItemsToLocalStorage(newItems);
  }
  addItem(id: string, quantity: number = 1) {
    const newValue = [...this.cartItems.value];
    newValue.push({ id, quantity });
    this.saveItemsToLocalStorage(newValue);
    this.cartItems.next(newValue);
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
    this.saveItemsToLocalStorage(this.cartItems.value);
  }
  incrementQuantity(id: string) {
    const index = this.cartItems.value.findIndex((e) => e.id === id);
    if (index > -1) {
      this.cartItems.value[index].quantity++;
    } else {
      this.cartItems.value.push({ id, quantity: 1 });
    }
    this.cartItems.next(this.cartItems.value);
    this.saveItemsToLocalStorage(this.cartItems.value);
  }
  getItem(id: string) {
    return this.cartItems.getValue().find((item) => item.id === id);
  }
}
