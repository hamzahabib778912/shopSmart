import { Product } from "./product";


export interface ShoppingCartItems{
  product: Product;
  quantity: number
}

export class ShoppingCart{
  items: ShoppingCartItems[] = [];

  constructor(items: ShoppingCartItems[]) {
    this.items = items;
  }

  get totalItemCount() {
    let cartQuantity = 0; // Reset quantity before recalculating
    for (let productId in this.items) {
      cartQuantity += this.items[productId].quantity;
    }
    return cartQuantity;
  }

}
