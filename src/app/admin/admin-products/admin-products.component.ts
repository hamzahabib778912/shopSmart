import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  searchTerm: string = '';

  constructor(private productService: ProductService) {
    // this.productService.getAll()
   }

 ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
    });
  }


  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1; // Reset to first page after filtering
  }

  onPageChange(page: number) {
    if (page > 0 && page <= this.pagesArray().length) {
      this.currentPage = page;
    }
  }

  paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  pagesArray() {
    return Array(Math.ceil(this.filteredProducts.length / this.pageSize)).fill(0).map((x, i) => i + 1);
  }

}
