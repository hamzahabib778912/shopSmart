import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, take } from 'rxjs';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  create() {
    const dateTime = new Date().getTime();
    return this.db.list('/shopping-carts').push({
      dateCreated: dateTime,
    });
  }

  getCart(cartId: string) {
    return this.db.object('/shopping-carts/' + cartId);
  }

  async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    const result = await this.create();
    localStorage.setItem('cartId', result.key!);
    return result.key!;
  }

  async getCartItems(): Promise<Observable<any>> {
    const cartId = await this.getOrCreateCartId();
    return this.getCart(cartId).snapshotChanges().pipe(
      map((action: any) => {
        const items = action.payload.val()?.items || {};
        return { key: action.key, items };
      })
    );
  }

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const itemRef = this.db.object(`/shopping-carts/${cartId}/items/${product.key}`);

    itemRef.snapshotChanges().pipe(take(1)).subscribe((item: any) => {
      const quantity = (item.payload.exists() ? item.payload.val().quantity : 0) + change;
      if (quantity === 0) itemRef.remove();
      else itemRef.update({ product, quantity });
    });
  }

  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    this.db.object(`/shopping-carts/${cartId}/items`).remove();
  }
}
