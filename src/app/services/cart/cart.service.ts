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
  private cartItems = new BehaviorSubject<any>({});
  items: Observable<any> = this.cartItems.asObservable();
  constructor(
    private authService: AuthService,
    private productService: ProductsService
  ) {
    try {
      const cartObject = JSON.parse(localStorage.getItem('cart')!);
      this.updateLocalStorageKey();
      if (
        !cartObject ||
        Array.isArray(cartObject) ||
        typeof cartObject !== 'object'
      ) {
        localStorage.setItem('cart', JSON.stringify({}));
      } else {
        const cartItems = cartObject[this.localStorageCartKey];
        if (!cartItems) {
          return;
        }

        const ids = Object.keys(cartItems);
        this.productService.getProductsByID(ids).subscribe((products) => {
          const filteredCartItems = this.sanatizeCartItems(cartItems, products);
          this.saveItems(filteredCartItems);
        });
      }
    } catch (e) {
      this.setDefaultCartValue();
    }
  }
  sanatizeCartItems(cartItems: any, products: any) {
    const filteredCartItems = { ...cartItems };
    Object.entries(cartItems).forEach(([id, quantity]: any) => {
      if (
        isNaN(quantity) ||
        !Number.isInteger(Number(quantity)) ||
        quantity < 1 ||
        quantity > 100 ||
        quantity === true ||
        quantity === false
      ) {
        delete filteredCartItems[id];
      } else {
        filteredCartItems[id] = Number(quantity);
      }
    });
    Object.keys({ ...filteredCartItems }).forEach((id) => {
      if (!products.find((p: Product) => p.skuId === id)) {
        delete filteredCartItems[id];
      }
    });
    return filteredCartItems;
  }
  setDefaultCartValue() {
    localStorage.setItem('cart', JSON.stringify({}));
  }
  saveItemsToLocalStorage(data: any) {
    const cart = JSON.parse(localStorage.getItem('cart')!);
    cart[this.localStorageCartKey] = data;
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  updateItem(item: CartItem) {
    const newItems = { ...this.cartItems.value };
    newItems[item.id] = item.quantity;
    this.saveItems(newItems);
  }
  addItem(id: string, quantity: number = 1) {
    const newValue = { ...this.cartItems.value };
    newValue[id] = quantity;
    this.saveItems(newValue);
  }
  updateLocalStorageKey() {
    this.localStorageCartKey = this.authService.isLoggedIn()
      ? this.authService.getUserId() || ''
      : 'cart';
  }
  removeItem(id: string) {
    const newItems = { ...this.cartItems.value };
    delete newItems[id];
    this.saveItems(newItems);
  }
  saveItems(val: any) {
    this.cartItems.next(val);
    this.saveItemsToLocalStorage(val);
  }
  updateCart() {
    const items = this.cartItems.value;
    this.updateLocalStorageKey();
    let userCartItems: any = [];
    try {
      const cartObject = JSON.parse(localStorage.getItem('cart')!);
      userCartItems = cartObject[this.localStorageCartKey] || {};
    } catch (e) {
      userCartItems = {};
    }
    this.productService
      .getProductsByID(Object.keys(userCartItems))
      .subscribe((products) => {
        userCartItems = this.sanatizeCartItems(userCartItems, products);
        const newItems = this.mergerCartItems(userCartItems, items);
        this.saveItems(newItems);
        const cartObject = JSON.parse(localStorage.getItem('cart')!);
        delete cartObject.cart;
        console.log('cartObject', cartObject);
        localStorage.setItem('cart', JSON.stringify(cartObject));
      });
  }
  mergerCartItems(userCartItems: any, items: any) {
    userCartItems = Object.entries(userCartItems).map(([id, quantity]) => ({
      id,
      quantity,
    }));
    items = Object.entries(items).map(([id, quantity]) => ({
      id,
      quantity,
    }));
    userCartItems.sort((a: any, b: any) => Number(a.id) - Number(b.id));
    items.sort((a: any, b: any) => Number(a.id) - Number(b.id));
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
    const obj: any = {};
    newItems.forEach((e: any) => {
      obj[e.id] = e.quantity;
    });
    return obj;
  }
  clearCart() {
    this.saveItems({});
  }
}
