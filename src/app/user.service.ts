// src/app/user.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { AppUser } from './models/app-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFireDatabase) {}

  save(user: firebase.User) {
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    }).then(() => console.log("User saved successfully"))
      .catch(error => console.error("Error saving user:", error));
  }

  getUser(uid: string): Observable<AppUser | null>{
    return this.db.object<AppUser | null>('/users/' + uid).valueChanges()
  }
}
