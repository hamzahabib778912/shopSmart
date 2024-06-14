import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnDestroy, OnInit{
  products$: any[] = [];
  filteredProducts: any;
  public categories: any[] = [];
  currentCategory: string = '';
  // private routeSub: Subscription;
  shoppingCart: any = { items: {} }

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private cartService : ShoppingCartService
  ) {}


  async ngOnInit(): Promise<void> {
    this.populateProducts();
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.cartService.getCartItems().then(cart$ => {
      cart$.subscribe(cart => {
        this.shoppingCart = cart;
        console.log('Shopping Cart:', this.shoppingCart);
      });
    });
  }

  private populateProducts() {
    this.productService.getAllProducts().pipe(
      switchMap(products => {
        this.products$ = products;
        return this.route.queryParamMap;
      })
    ).subscribe(params => {
      this.currentCategory = params.get('category') || '';
      this.filterProducts();
    });
  }

  ngOnDestroy(): void {
    // if (this.routeSub) {
    //   this.routeSub.unsubscribe(); // Unsubscribe to avoid memory leaks
    // }
  }

  filterProducts(): void {
    if (this.currentCategory.trim() !== '') {
      this.filteredProducts = this.products$.filter(
        (p) => p.category === this.currentCategory
      );
    } else {
      this.filteredProducts = [...this.products$]; // Reset filteredProducts if no category selected
    }
  }
}
