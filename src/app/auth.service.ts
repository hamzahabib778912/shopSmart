import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/compat/auth';
import * as auth from 'firebase/auth'

import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$!: Observable<firebase.User | null>;
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();


  constructor(private afAuth: AngularFireAuth, private router: Router, private userService: UserService) {
    this.user$ = this.afAuth.authState;

    this.user$.subscribe(user => {
      if (user) {
        this.userService.getUser(user.uid).subscribe(dbUser => {
          this.isAdminSubject.next(dbUser?.isAdmin || false);
        });
      }
    });
  }

  async login() {
    await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then((response) => {
      this.router.navigate(['/']);
      if (response.user) {
        this.userService.save(response.user);
      }
      console.log("Yayyy Google done", response)
    }).catch(error => {
      debugger
      console.error('Error during login: ', error);
    });
  }

  async loginCredentials(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password).then((response) => {
      this.router.navigate(['/'])
      if (response.user) {
        this.userService.save(response.user);
      }
      console.log("Ok done", response)
    }).catch(error => {
      debugger
      console.error('Error during email/password login:', error);
    });
  }

  async logout() {
    await this.afAuth.signOut().then(() => this.router.navigate(['/login']))
  }

}
