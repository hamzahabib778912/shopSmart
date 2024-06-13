import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db : AngularFireDatabase) { }

  getCategories(){
    return this.db.list('/categories').snapshotChanges().pipe(
      map(actions => actions.map(action => ({ key: action.key, ...action.payload.val() as {} })))
    );
  }
}
