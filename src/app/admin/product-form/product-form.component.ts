import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { CategoryService } from 'src/app/category.service';
import { ProductService } from 'src/app/product.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  categories: any[] = [];
  isEdit = false;
  id: string | null = null;

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });

    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.id = this.route.snapshot.params?.['id'];
    console.log('Fetching data for the id: ', this.id);
    if (this.id) {
      this.isEdit = true;
      this.productService
        .getProductById(this.id)
        .pipe(take(1))
        .subscribe((product: any) => {
          this.form.setValue({
            title: product.title,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl,
          });
        });
    }
  }

  get title() {
    return this.form.get('title');
  }

  get price() {
    return this.form.get('price');
  }

  get category() {
    return this.form.get('category');
  }

  get imageUrl() {
    return this.form.get('imageUrl');
  }

  save() {
    if (this.form.invalid) return;

    const product = this.form.value;
    if (this.isEdit && this.id) {
      this.productService.updateProduct(this.id, product);
    } else {
      this.productService.create(product);
    }

    this.router.navigate(['/admin/products']);
  }

  delete(): void {
    this.modalService.open(this.confirmDeleteModal).result.then(
      (result) => {
        if (result === 'yes') {
          this.deleteProduct();
        }
      },
      (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      }
    );
  }

  private deleteProduct(): void {
    if (this.id) {
      this.productService.deleteProduct(this.id);
      this.router.navigate(['/admin/products']);
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
