import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, of } from 'rxjs';
import { CartItem } from './cartItem';
import { AuthService } from '../auth/auth.service';
import { ProductsService } from '../products/products.service';
import { Product } from 'src/app/product';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private localStorageCartKey = 'cart';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  items: Observable<CartItem[]> = this.cartItems.asObservable();
  constructor(
    private authService: AuthService,
    private productService: ProductsService
  ) {
    this.updateLocalStorageKey();
    try {
      const cartItems = JSON.parse(
        localStorage.getItem(this.localStorageCartKey)!
      );
      if (!cartItems) {
        this.cartItems.next([]);
      } else {
        let filteredCartItems = cartItems.filter(
          (item: CartItem) =>
            item.id && !isNaN(item.quantity) && item.quantity >= 1
        );
        const ids = filteredCartItems.map((item: any) => item.id);
        this.productService.getProductsByID(ids).subscribe((products) => {
          filteredCartItems = filteredCartItems.filter((item: CartItem) =>
            products.find((p: Product) => p.skuId === item.id)
          );
          if (filteredCartItems.length != cartItems.length) {
            this.saveItemsToLocalStorage(filteredCartItems);
          }
          this.cartItems.next(filteredCartItems);
        });
      }
    } catch (e) {
      this.cartItems.next([]);
      localStorage.setItem(this.localStorageCartKey, '[]');
    }
  }
  saveItemsToLocalStorage(data: CartItem[]) {
    localStorage.setItem(this.localStorageCartKey, JSON.stringify(data));
  }
  updateItem(newItem: CartItem) {
    const newItems = this.cartItems.value.map((item) =>
      item.id === newItem.id ? newItem : item
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
  updateLocalStorageKey() {
    this.localStorageCartKey =
      'cart' +
      (this.authService.isLoggedIn() ? '/' + this.authService.getUserId() : '');
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
          quantity: userCartItems[i].quantity + items[j].quantity,
        });
        i++;
        j++;
      } else if (Number(userCartItems[i].id) < Number(items[j].id)) {
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
