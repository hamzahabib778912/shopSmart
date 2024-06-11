import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/compat/auth';
import * as auth from 'firebase/auth'

import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$!: Observable<firebase.User  | null>;
  constructor(private afAuth : AngularFireAuth) {
    this.user$ =  this.afAuth.authState;
  }

  async login(){
    debugger
    await this.afAuth.signInWithRedirect(new auth.GoogleAuthProvider()).then((response) => {
      debugger
      console.log("Yayyy Google done", response)
    }).catch(error => {
      debugger
      console.error('Error during login: ', error);
    });
  }

  async loginCredentials(email : string, password: string){
    await this.afAuth.signInWithEmailAndPassword(email, password).then((response) => {
      debugger
      console.log("Ok done", response)
    }).catch(error => {
      debugger
      console.error('Error during email/password login:', error);
    });
  }

  logout(){
    this.afAuth.signOut()
  }
}
