import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private db: AngularFireDatabase) {}

  create(product: any) {
    return this.db.list('/products').push(product);
  }

  getAllProducts(): Observable<any[]> {
    // return this.db.list('/products').valueChanges();
    return this.db.list('/products').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const key = a.payload.key;
        const data = a.payload.val() as {};
        return { key, ...data };
      }))
    );
  }

  updateProduct(id: string, product: any) {
    return this.db.object('/products/' + id).update(product);
  }

  deleteProduct(productId: string) {
    return this.db.object('/products/' + productId).remove();
  }

  getProductById(key: string){
    // return this.db.object('/products' + key);
    return this.db.object('/products/' + key).valueChanges();
  }
}
