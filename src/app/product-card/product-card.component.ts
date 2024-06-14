import { Component, Input, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { Product } from '../models/product';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent  {

  @Input('product') product?: Product;
  @Input('shopping-cart') shoppingCart?: any;
  constructor(private cartService: ShoppingCartService) { }

  async addToCart(){
    let cartId = localStorage.getItem('cartId')

    if (!cartId) {
      // Create a new cart
      const result = await this.cartService.create();
      cartId = result.key ?? '';
      localStorage.setItem('cartId', cartId);
    }

    // Add the product to the cart (this is a placeholder for the actual implementation)
    if (this.product && cartId) {
      this.cartService.addToCart(this.product);
    }
  }

  getQuantity() {
    if (this.product && this.shoppingCart) {
      const item = this.shoppingCart.items?.[this.product.key];
      return item ? item.quantity : 0;
    }
    return 0;
  }

 async removeFromCart(){
    let cartId = localStorage.getItem('cartId')
    if (this.product && cartId) {
      await this.cartService.removeFromCart(this.product)
    }
  }

}
