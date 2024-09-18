import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from './cartItem';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private localStorageCartKey = 'cart';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  items: Observable<CartItem[]> = this.cartItems.asObservable();
  constructor(private authService: AuthService) {
    this.updateLocalStorageKey();
    try {
      const cartItems = JSON.parse(
        localStorage.getItem(this.localStorageCartKey)!
      );
      if (!cartItems) {
        this.cartItems.next([]);
      } else {
        const filteredCartItems = cartItems.filter(
          (e: CartItem) => e.id && !isNaN(e.quantity) && e.quantity >= 1
        );
        if (filteredCartItems.length != cartItems.length) {
          this.saveItemsToLocalStorage(filteredCartItems);
        }
        this.cartItems.next(filteredCartItems);
      }
    } catch (e) {
      this.cartItems.next([]);
      localStorage.setItem(this.localStorageCartKey, '[]');
    }
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
  updateLocalStorageKey() {
    this.localStorageCartKey =
      'cart' +
      (this.authService.isLoggedIn() ? '/' + this.authService.getUserId() : '');
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
  removeItem(id: string) {
    const newItems = this.cartItems.value.filter((item) => item.id !== id);
    this.cartItems.next(newItems);
    this.saveItemsToLocalStorage(newItems);
  }
  updateCart() {
    const items = this.cartItems.value;
    this.updateLocalStorageKey();
    let userCartItems: CartItem[] = [];
    try {
      userCartItems = JSON.parse(
        localStorage.getItem(this.localStorageCartKey)!
      );
    } catch (e) {}
    const newItems = this.mergerCartItems(userCartItems, items);
    this.cartItems.next(newItems);
    localStorage.setItem(this.localStorageCartKey, JSON.stringify(newItems));
    localStorage.removeItem('cart');
  }
  mergerCartItems(userCartItems: CartItem[], items: CartItem[]) {
    userCartItems.sort((a, b) => Number(a.id) - Number(b.id));
    items.sort((a, b) => Number(a.id) - Number(b.id));
    const newItems = [];
    let i = 0,
      j = 0;
    while (i < userCartItems.length && j < items.length) {
      if (userCartItems[i].id === items[j].id) {
        newItems.push({
          id: userCartItems[i].id,
          quantity: Math.min(userCartItems[i].quantity + items[j].quantity, 20),
        });
        i++;
        j++;
      } else if (userCartItems[i].id < items[j].id) {
        newItems.push(userCartItems[i]);
        i++;
      } else {
        newItems.push(items[j]);
        j++;
      }
    }
    while (i < userCartItems.length) {
      newItems.push(userCartItems[i++]);
    }
    while (j < items.length) {
      newItems.push(items[j++]);
    }
    return newItems;
  }
  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem(this.localStorageCartKey);
  }
}
