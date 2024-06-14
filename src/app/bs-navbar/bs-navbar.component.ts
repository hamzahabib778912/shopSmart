import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {
  isAdmin$ = this.auth.isAdmin$;
  cartQuantity = 0;
  shoppingCart: ShoppingCart | null = null;
  constructor(public auth : AuthService, private cartService: ShoppingCartService) {
  }

  logout(){
      this.auth.logout()
  }

 async ngOnInit(): Promise<void> {
  const cart$ = await this.cartService.getCartItems();
  cart$.subscribe(cart => {
    this.shoppingCart = new ShoppingCart(cart?.items);
    this.cartQuantity = this.shoppingCart.totalItemCount;
  });
}
}
